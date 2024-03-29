---
id: whm_acquisitions
title: WHM plugin - acquisitions
sidebar_position: 10
---

TODO: clean up

For log files acquisitions
Only necessary fields are:
- Acquisition file name
- Source : file
- log Type : based on the highest level parser, you can check your intalled parsers, for example apache2-logs would give a log type = apache2
- Filenames : path of log files of folders, whildcard can be used
- optionnally exclude regexps if your targetting a folder with many files and you want crowdsec to NOT bother about bkup,lock files ...


example:

Acquisition file name: myNginxAcquisition.yaml
source: file
log type: nginx
filenames:
  - /var/log/custom_nginx_log_path/*.log

