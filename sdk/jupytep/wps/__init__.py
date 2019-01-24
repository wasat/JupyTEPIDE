import configparser

class jupytepideWPS:
    @staticmethod
    def saveCellasWPS(i,filename):
        config=configparser.ConfigParser()
        config.read('config.ini')
        wps_deploy_path=config['PATH']['wpsdeploypath']
        rows=In[i].split('\n')
        with open(wps_deploy_path+filename,'w') as file1:
            for row in rows:
                if not row.endswith('\n'):
                    row+='\n'
                file1.write(row)

    @staticmethod
    def InsertTemplate(self):
        from IPython.display import display_javascript
        config = configparser.ConfigParser()
        config.read('config.ini')
        wps_deploy_path = config['PATH']['wpsdeploypath']
        with open(wps_deploy_path+'template.py', 'r') as content_file:
            s = content_file.read()
        text = s.replace('\n', '\\n').replace("\"", "\\\"").replace("'", "\\'")
        text2 = """var t_cell = IPython.notebook.get_selected_cell()
       t_cell.set_text('{}');
       var t_index = IPython.notebook.get_cells().indexOf(t_cell);
       IPython.notebook.to_code(t_index);
       IPython.notebook.get_cell(t_index).render();""".format(text)
        display_javascript(text2, raw=True)




