import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

population_path = os.path.join("data", "population.csv")
population_df = pd.read_csv(population_path)

print(population_df.head())

import sys
print(sys.path)
