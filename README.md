
![Logo](http://utils.bytecodes.club/lpc-Panel.png)


## Setup LPC Account


```bash
    First go to http://lc-manager.bytecodes.club and create you account  
```
![App Screenshot](http://utils.bytecodes.club/1.png)
![App Screenshot](http://utils.bytecodes.club/2.png)

```bash
    After that you have to click on + icon which located on navigation and create machine and enter you machine name
```
![App Screenshot](http://utils.bytecodes.club/3.png)
![App Screenshot](http://utils.bytecodes.club/4.png)

```bach
    After that your manchine name is now visible on website or app now click on copy icon for copy machine id
```

## Installation

Install scpanel

```bash
  npm install lpcpanel -g
```


## Setup
 
To setup this package run

```bash
  lpcpanel setup
```
After setup complete and start server go to [http://lc-manager.bytecodes.club](http://lc-manager.bytecodes.club) and perform login with your id and password.
Note:- For setup lpcpanel you must have your machine id. for machine id perform process whcih explaied on above images.

## Features

- used for controle file system of local computer or laptop
- Create Folder/File
- Delete Folder/File
- Copy Folder/File
- Move Folder/File
- Rename Folder/File


## TODO

- [ ] File/Folder download api integration
- [ ] Public File/Folder Download/Upload link generator api
- [ ] File/Folder Upload api integration
- [ ] Nodejs Project initilizer api integration
- [ ] static web hosting like netlify

## Usage/Examples

To setup lpcpanel
```bash
  lpcpanel setup
```
To start server after setup
```bash
  lpcpanel start
```
To stop server after start
```bash
  lpcpanel stop
```
## Tech Stack

**Client:** Flutter, Getx, http, etc

**Server:** Node, Express, pm2, socket.io etc


## Related

Here are some related projects
source code of user-interface lc-manager this project used as client-side of lpcpanel
[lc-manager](https://github.com/ByteCodes-Club/scpanel_ui)

source code of server of lpcpanel which manager all events 
[lpc_server](https://github.com/ByteCodes-Club/scpanel_ui)