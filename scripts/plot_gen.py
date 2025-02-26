import json

import matplotlib.pyplot as plt

with open("./res.txt") as res_file:
    res = json.load(res_file)

good_len = -1
bad_len = -1
with open("../fortune_generator/json/fortune.json") as fortune_file:
    j = json.load(fortune_file)
    good_len = len(j["goodFortunes"])
    bad_len = len(j["badFortunes"])

status_bucket = [0] * 8
good_bucket = [0] * good_len
bad_bucket = [0] * bad_len

for ip, v in res.items():
    assert all(val != -1 for val in v)
    good_bucket[v[0]] += 1
    good_bucket[v[1]] += 1
    bad_bucket[v[2]] += 1
    bad_bucket[v[3]] += 1
    status_bucket[v[4]] += 1


groups = 1
fig, axs = plt.subplots(groups, 1, figsize=(8, 6))

axs.bar(
    range(good_len),
    good_bucket,
    color="skyblue",
    edgecolor="black",
)
axs.set_xlabel("Good Fortune Event Index")
axs.set_ylabel("Occurrences")

plt.tight_layout()
plt.show()

fig, axs = plt.subplots(groups, 1, figsize=(8, 6))

axs.bar(
    range(bad_len),
    bad_bucket,
    color="skyblue",
    edgecolor="black",
)
axs.set_xlabel("Bad Fortune Event Index")
axs.set_ylabel("Occurrences")

plt.tight_layout()
plt.show()

fig, axs = plt.subplots(groups, 1, figsize=(8, 6))

axs.bar(
    range(len(status_bucket)),
    status_bucket,
    color="skyblue",
    edgecolor="black",
)
axs.set_xlabel("Status Index")
axs.set_ylabel("Occurrences")

plt.show()
