#!/bin/python3

import os
import json
import shutil
import logging
import argparse

args_parser = argparse.ArgumentParser(description="Generator Template Generator")
args_parser.add_argument("config", type=str, help="config json path", nargs="?")
args = args_parser.parse_args()

if args.config:
    config = None
    with open(args.config, "r") as f:
        config = json.loads(f.read())

    name = config["name"]
    desc = config["desc"]
    title = config["title"]
    repo_name = config["repo_name"]

else:
    name = input("Generator name (like fortune, quote): ")
    desc = input("Generator desc: ")
    title = input("Generator title: ")
    repo_name = input("Github repo name: ")

folder_path = f"{name}_generator"

if os.path.exists(folder_path):
    logging.error(f"{folder_path} already exists. Please choose another name.")
    exit(1)

os.mkdir(folder_path)
os.mkdir(f"{folder_path}/css")
os.mkdir(f"{folder_path}/js")
os.mkdir(f"{folder_path}/images")
os.mkdir(f"{folder_path}/json")


def write_file(src_path, dst_path, **kwargs):
    content = None
    with open(f"scripts/template/{src_path}", "r") as f:
        content = f.read()

    for key, val in kwargs.items():
        assert (
            content.find("{{ %s }}" % key) != -1
        ), f"The key '{key}' does not appear in scripts/template/{src_path}"
        content = content.replace("{{ %s }}" % key, val)

    with open(dst_path, "w") as f:
        f.write(content)


write_file("css/styles.css", f"{folder_path}/css/styles.css")
write_file("js/main.js", f"{folder_path}/js/{name}.js", name=name)
write_file("js/matrix.js", f"{folder_path}/js/matrix.js")
write_file("js/scripts.js", f"{folder_path}/js/scripts.js")
write_file("js/theme.js", f"{folder_path}/js/theme.js")
write_file(
    "js/service-worker.js",
    f"{folder_path}/js/service-worker.js",
    name=name,
    repo_name=repo_name,
    folder_path=folder_path,
)
write_file(
    "manifest.json",
    f"{folder_path}/manifest.json",
    title=title,
    desc=desc,
    repo_name=repo_name,
    folder_path=folder_path,
)
write_file("json/themes.json", f"{folder_path}/json/themes.json")
write_file("index.html", f"{folder_path}/index.html", name=name, desc=desc, title=title)
shutil.copytree("scripts/template/images", f"{folder_path}/images", dirs_exist_ok=True)
