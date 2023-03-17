#!/usr/bin/env python
# coding: utf-8

# # 1. Convert .xpt to csv 

# In[45]:


import pandas as pd
import xport,xport.v56,csv,os
# must import pandas with `pip install pandas>=1.3.5`
print('currently at:',os.getcwd())


# In[55]:


input_file = input('input: ')
output_file = input('output: ')


# In[49]:


ds = xport.Dataset()
with open(input_file, 'rb') as f:
    library = xport.v56.load(f)


# In[51]:


library[list(library)[0]].to_csv(output_file)

