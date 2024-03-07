import matplotlib.pyplot as plt

# Data Processing
groups = 2

with open('./good_fortune_data.txt', 'r') as f:
    good_fortune_data = [int(line.split(' ')[1].strip()) for line in f.readlines()]
    good_fortune_data_len = len(good_fortune_data) // groups

fig, axs = plt.subplots(groups, 1, figsize=(8, 6))

axs[0].bar(range(good_fortune_data_len), good_fortune_data[:good_fortune_data_len], color='skyblue', edgecolor='black')
axs[0].set_xlabel("Good Fortune Event Index")
axs[0].set_ylabel("Occurrences")

axs[1].bar(range(good_fortune_data_len), good_fortune_data[good_fortune_data_len:], color='skyblue', edgecolor='black')
axs[1].set_xlabel("Good Fortune Event Index")
axs[1].set_ylabel("Occurrences")

plt.tight_layout()

plt.savefig("../docs/good_fortune_statistics.png")

with open('./bad_fortune_data.txt', 'r') as f:
    bad_fortune_data = [int(line.split(' ')[1].strip()) for line in f.readlines()]
    bad_fortune_data_len = len(bad_fortune_data) // groups

fig, axs = plt.subplots(groups, 1, figsize=(8, 6))

axs[0].bar(range(bad_fortune_data_len), bad_fortune_data[:bad_fortune_data_len], color='skyblue', edgecolor='black')
axs[0].set_xlabel("Bad Fortune Event Index")
axs[0].set_ylabel("Occurrences")

axs[1].bar(range(bad_fortune_data_len), bad_fortune_data[bad_fortune_data_len:], color='skyblue', edgecolor='black')
axs[1].set_xlabel("Bad Fortune Event Index")
axs[1].set_ylabel("Occurrences")

plt.tight_layout()

plt.savefig("../docs/bad_fortune_statistics.png")