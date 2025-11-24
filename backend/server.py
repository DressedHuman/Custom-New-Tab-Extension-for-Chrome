import sqlite3
import uuid
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this!
CORS(app)  # Enable CORS for all routes
auth = HTTPBasicAuth()

# Admin credentials (change these!)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

@auth.verify_password
def verify_password(username, password):
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return username
    return None

# Database setup
DB_NAME = "keys.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Create keys table with used column
    c.execute('''CREATE TABLE IF NOT EXISTS keys
                 (key TEXT PRIMARY KEY, 
                  active BOOLEAN,
                  used BOOLEAN DEFAULT 0,
                  used_at TIMESTAMP)''')
    
    # Create purchases table
    c.execute('''CREATE TABLE IF NOT EXISTS purchases
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT NOT NULL,
                  payment_method TEXT NOT NULL,
                  activation_key TEXT,
                  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (activation_key) REFERENCES keys(key))''')
    
    # Migrate existing database if needed
    c.execute("PRAGMA table_info(keys)")
    columns = [col[1] for col in c.fetchall()]
    if 'used' not in columns:
        c.execute("ALTER TABLE keys ADD COLUMN used BOOLEAN DEFAULT 0")
    if 'used_at' not in columns:
        c.execute("ALTER TABLE keys ADD COLUMN used_at TIMESTAMP")
    
    conn.commit()
    conn.close()

init_db()

# API Routes (for extension)
@app.route("/generate", methods=["POST"])
def generate_key():
    new_key = str(uuid.uuid4())
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO keys (key, active) VALUES (?, ?)", (new_key, True))
    conn.commit()
    conn.close()
    return jsonify({"key": new_key})

@app.route("/verify", methods=["POST"])
def verify_key():
    data = request.get_json()
    key = data.get("key")
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT active, used FROM keys WHERE key = ?", (key,))
    result = c.fetchone()

    if result:
        active, used = result
        if active and not used:
            # Mark key as used
            c.execute("UPDATE keys SET used = 1, used_at = CURRENT_TIMESTAMP WHERE key = ?", (key,))
            conn.commit()
            conn.close()
            return jsonify({"valid": True, "message": "Activation successful"})
        elif used:
            conn.close()
            return jsonify({"valid": False, "message": "This key has already been used"})
        else:
            conn.close()
            return jsonify({"valid": False, "message": "Key is inactive"})
    else:
        conn.close()
        return jsonify({"valid": False, "message": "Invalid activation key"})

@app.route("/stats", methods=["GET"])
def get_stats():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM keys")
    count = c.fetchone()[0]
    conn.close()
    return jsonify({"active_keys": count})

# Purchase Routes
@app.route("/purchase", methods=["GET"])
def purchase_page():
    return render_template('purchase.html', success=False)

@app.route("/purchase", methods=["POST"])
def process_purchase():
    name = request.form.get('name')
    email = request.form.get('email')
    payment_method = request.form.get('payment_method')
    
    # Generate activation key
    new_key = str(uuid.uuid4())
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Insert key
    c.execute("INSERT INTO keys (key, active) VALUES (?, ?)", (new_key, True))
    
    # Insert purchase record
    c.execute("INSERT INTO purchases (name, email, payment_method, activation_key) VALUES (?, ?, ?, ?)",
              (name, email, payment_method, new_key))
    
    conn.commit()
    conn.close()
    
    return render_template('purchase.html', success=True, activation_key=new_key)

# Admin Routes
@app.route("/admin")
@auth.login_required
def admin_panel():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT key, active, used, used_at FROM keys ORDER BY key")
    keys = c.fetchall()
    c.execute("SELECT COUNT(*) FROM keys")
    total_keys = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM keys WHERE active = 1")
    active_keys = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM keys WHERE used = 1")
    used_keys = c.fetchone()[0]
    conn.close()
    
    return render_template('admin.html', 
                         keys=keys, 
                         total_keys=total_keys,
                         active_keys=active_keys,
                         used_keys=used_keys,
                         message=request.args.get('message'))

@app.route("/admin/generate", methods=["POST"])
@auth.login_required
def admin_generate_key():
    new_key = str(uuid.uuid4())
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO keys (key, active) VALUES (?, ?)", (new_key, True))
    conn.commit()
    conn.close()
    return redirect(url_for('admin_panel', message=f'New key generated: {new_key}'))

@app.route("/admin/delete/<key>", methods=["POST"])
@auth.login_required
def admin_delete_key(key):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM keys WHERE key = ?", (key,))
    conn.commit()
    conn.close()
    return redirect(url_for('admin_panel', message='Key deleted successfully'))

if __name__ == "__main__":
    app.run(debug=True)
