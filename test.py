import requests

r = requests.get("http://localhost:8000/foo/bar")
print(r.content)