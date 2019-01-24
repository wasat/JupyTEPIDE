# JupyTEP IDE GUI Extensions
Extensions for JupyTEP IDE User Interface<br>
--------------------------------------------------------------<br>
It is a preliminary version.<br>
## Installation
### To install manually: <br>
Place the "source_UI" directory into your server's extension dir. For example <local user>:<br>
/home/user/.local/share/jupyter/nbextensions<br>
<br>
To enable - in file: <br>
/home/user/.jupyter/nbconfig/notebook.json <br>
one should have:<br>
```
{
  "load_extensions": {
    "source_UI/main": true
  }
}
```

### Automatic installation<br>
```
jupyter nbextension install source_UI/main --user
```
then, enable it by:<br>
```
jupyter nbextension enable source_UI/main --sys-prefix