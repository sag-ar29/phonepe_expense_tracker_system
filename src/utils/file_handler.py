""" Read transaction data from the text file and write summmury to a JSON file  """
from pathlib import Path
import json
import logging

logger = logging.getLogger("PhonePeTracer")

def read_text_file(file_path : Path) -> list[str]:
    """read the text file and return the list of lines"""
    if file_path.exists():
        with open(file_path,"r",encoding = "utf-8") as f:
            return f.readlines()
    else:
        logger.error(f"file not found :{file_path}")
        return []

def write_json_file(data : dict, output_path : Path) -> None:
    '''write data to a JSON file '''
    with open(output_path, "w",encoding= "utf-8") as f:
        json.dump(data,f,indent=4)
    logger.info(f"Data writeen to {output_path}")



    