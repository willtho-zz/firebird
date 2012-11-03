"""This is the database driver"""
import sqlite3

def connect(dbname):
    """Connect to the database"""
    pass

def setup():
    """Set up the database"""
    pass

def authenticate(username, password):
    """Match the username and password with those in the database.
    Return a boolean for True or False"""
    pass

def add(item):
    """Add the item to the database"""
    pass

def remove(uid):
    """Remove the item with uid from the database"""
    pass

def edit(item):
    """Update the item in the database"""
    pass

def get_item(uid):
    """Get the item with uid"""
    pass

def get_items(category):
    """Get the items from category"""
    pass
