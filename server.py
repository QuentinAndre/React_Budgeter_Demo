from app import app
import os
if __name__ == "__main__":
    # Fetch the environment variable (so it works on Heroku):
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))