This folder contains a sample Jupyter GUI extension based on their documentation. I'ts written in JavaScript.
How to load it into Jupyter is described below.
These are some troublesooting comments of mine. Next time I'll try to use less Polish language :). Maybe I'll translate it in near future.

## ŁADOWANIE ROZSZERZENIA - 
PAMIĘTAĆ: install trzeba robić po każdej modyfikacji kodu (jeżeli żródło trzyma się w innym miejscu). 
Enable robi się TYLKO RAZ

przykładowe załadowanie nbextention (frontendowe rozszerzenie, nie serwerowe):

michal@michal-Inspiron-N5110 ~/anaconda3 $ jupyter nbextension install ../moj_jupyter_extension/ --user
Making directory: /home/michal/.local/share/jupyter/nbextensions/moj_jupyter_extension/
Copying: /home/michal/moj_jupyter_extension/main.js -> /home/michal/.local/share/jupyter/nbextensions/moj_jupyter_extension/main.js
Copying: /home/michal/moj_jupyter_extension/main.js~ -> /home/michal/.local/share/jupyter/nbextensions/moj_jupyter_extension/main.js~

    To initialize this nbextension in the browser every time the notebook (or other app) loads:
    
          jupyter nbextension enable <the entry point> --user

##
teraz inicjalizacja (to modyfikuje plik ".jupyter/nbconfig/notebook.json"):
michal@michal-Inspiron-N5110 ~/anaconda3 $ jupyter nbextension enable /moj_jupyter_extension/main
Enabling notebook extension /moj_jupyter_extension/main...
      - Validating: OK


##
info o załadowanych extensions trafia tu (dla usera):
/home/michal/.jupyter/nbconfig/notebook.json

albo tu (dla wszystkich) - dashboards instalowałem przez: conda install jupyter_dashboards -c conda-forge
~/anaconda3/etc/jupyter/nbconfig/notebook.json
{
  "load_extensions": {
    "jupyter-js-widgets/extension": true,
    "jupyter_dashboards/notebook/main": true
  }
}

i tu się robi syf jak to się wiele razy instaluje. Trzeba raz, a modyfikacja kodu i tak będzie widoczna

##
oni mają zrąbany instalator.... podczas instalacji trzeba było podać ścieżkę ze "/" na początku. Potem po umieszczeniu tej ścieżki w notebook.json trzeba ten "/" wywalić... :
//noteboo.json wygląda tak:
{
  "load_extensions": {
    "notebook-extensions-master/calysto/document-tools/main": true,
    "moj_jupyter_extension/main": true
  }
}

##
deinstalacja - przykład

jupyter nbextension disable --py jupyter_dashboards --sys-prefix
jupyter nbextension uninstall --py jupyter_dashboards --sys-prefix

## 
ŚĆIEŻKI
dashboards znajduje się:
/home/michal/anaconda3/lib/python3.6/site-packages/jupyter_dashboards

jupyter-js-widgets znajduje się:
/home/michal/anaconda3/pkgs/widgetsnbextension-2.0.0-py36_0/share/jupyter/nbextensions/jupyter-js-widgets

dashboards i js-widgets znajduja się też tu (stąd się zapewne ładują a powyższe to repozytorium):
/home/michal/anaconda3/share/jupyter/nbextensions

moj dodatek zainstalował się do:
/home/michal/.local/share/jupyter/nbextensions/moj_jupyter_extension

##
TODO (przyszłość sprawdzić i rozwiązać):

uwagi do instalacji extensions
prawdopodobnie polecenie

jupyter nbextension install ../moj_jupyter_extension/ --user

instaluje dla użytkownika, przez flagę --user

bez niej nie miałem uprawnień do innych katalogów i nie chciało się zainstalować (więc wtedy pewnie instaluje dla całego serwera)
bez --user nie działało też z sudo. 

##
moj dodatek zapisany jest:
/home/michal/moj_jupyter_extension

i stąd go instaluję na serwerze
