# source_UI
Extensions for JupytepIDE User Interface<br>
----------------------------------------<br>
It is a preliminary version.<br>
## Instalation
### To install manually: <br>
Place the "source_UI" directory into your server's extension dir. For example <local user>:<br>
/home/user/.local/share/jupyter/nbextensions<br>
<br>
To enable: in <br>
/home/user/.jupyter/nbconfig/notebook.json one should have:<br>
```
{
  "load_extensions": {
    "source_UI/main": true
  }
}
```
<br>
### Automatic installation:<br>
jupyter nbextension install source_UI/main --user<br>
<br>
then, enable it by:<br>
jupyter nbextension enable source_UI/main --sys-prefix<br>



