# -*- coding: utf-8 -*-
# adelshb, github.com/adelshb
# 2018/02/11

import datetime
import pandas as pd
import requests
from lxml import html
from datetime import date, timedelta

def eco2mix_parser(url):
    
    # Load the page contening the informations
    page = requests.get(url)
    tree = html.fromstring(page.content)
    
    # Create the data frame and fill the Date&Time column from the url request
    data = pd.DataFrame()
    data.loc[:,'Date&Time'] = pd.date_range(tree.xpath("//date_debut/text()")[0], periods=len(tree.xpath("//type[@v='Nucléaire' and @granularite='Global']/valeur/text()")), freq='15Min')
    
    # Parse the information about the Energy Production
    types = tree.xpath("//type")
    for t in types:
        data.loc[:,t.get('v') + '-' + t.get('granularite')] = pd.Series(tree.xpath("//type[@v='" + t.get('v') + "' and @granularite='" + t.get('granularite') + "']/valeur/text()"))
    
    return data

d1 = date(2016, 1, 1)  # start date
d2 = date(2016, 12, 31)  # end date
delta = d2 - d1         # timedelta

dates = [datetime.datetime.strptime(str(d1 + timedelta(days=i)), '%Y-%m-%d').strftime('%d/%m/%Y') for i in range(delta.days + 1)]

temp_url = "http://www.rte-france.com/getEco2MixXml.php?type=mix&&dateDeb=" + dates[0] +"&dateFin=" + dates[0] +"&mode=NORM"
DATA = eco2mix_parser(temp_url)   

print('In process...')
for date in dates[1:]:
    print(date)
    temp_url = "http://www.rte-france.com/getEco2MixXml.php?type=mix&&dateDeb=" + date +"&dateFin=" + date +"&mode=NORM"
    temp = eco2mix_parser(temp_url)
    DATA = DATA.append(temp, ignore_index=True)

DATA.to_csv('eco2mix_data.csv')
print('Done!')
