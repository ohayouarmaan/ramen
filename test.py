import requests

r = requests.get("http://localhost:8000/bar/bar")
print(r.content)