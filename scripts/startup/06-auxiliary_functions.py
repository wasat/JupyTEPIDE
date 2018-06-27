from shutil import copyfile


def replace_result(sourcefile, dest='/home/jovyan/results/results.tif'):
    copyfile(sourcefile, dest)
