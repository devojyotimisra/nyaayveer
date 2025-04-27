from sentence_transformers import SentenceTransformer
from huggingface_hub import hf_hub_download
import pickle
import xgboost
import warnings


warnings.filterwarnings("ignore")

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

repo_id = "team-sankalp/xg_models_minilm_big_1.0"
model_name = repo_id.split("/")[1]+".pkl"

models_path = hf_hub_download(repo_id=repo_id, filename=model_name, repo_type="model")

with open(models_path, "rb") as f:
    classifiers = pickle.load(f)

repo_id = "team-sankalp/sections_big_1.0"
data_name = repo_id.split("/")[1]+".pkl"

data_path = hf_hub_download(repo_id=repo_id, filename=data_name, repo_type="dataset")

with open(data_path, "rb") as f:
    sections = pickle.load(f)


def predict(text):
    vec = model.encode(text)
    final_bns = []
    out = []
    for c in classifiers:
        out.append(c.predict([vec]))
    for i in range(len(out)):
        if (out[i] == 1):
            final_bns.append(sections[i])
    reply = {"output": final_bns}
    return reply
