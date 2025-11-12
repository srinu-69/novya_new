from database import engine, Base
import models

def migrate_database():
    print("Creating/updating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database migration completed!")

if __name__ == "__main__":
    migrate_database()