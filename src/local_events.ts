import { Socket } from "socket.io-client";
import { PathLike, promises as fs, createReadStream, exists, existsSync, rmdir, createWriteStream } from 'fs'

import { arch, homedir, hostname, platform, release, type, version, } from 'os';
import archiver from "archiver";
import { v4 as uuidV4 } from 'uuid'
import screensHot from 'screenshot-desktop'
screensHot({ format: 'gif' });

export const events = async (socket: Socket) => {

    socket.on('READ_DIR', async (data: RDIrData) => {
        try {
            let directory: Files[] = [];
            let dir = await fs.readdir(data.path, { withFileTypes: true });
            dir.map((e) => {
                if (data.hidden == "true") {
                    directory.push({ "name": e.name, "isFile": e.isDirectory() })
                } else {
                    if (e.name[0] != '.') directory.push({ "name": e.name, "isFile": e.isDirectory() });
                }
            });
            console.log('point c');

            socket.emit(data.mid, { status: true, directory });
        } catch (error: any) {
            console.log('point error local');

            socket.emit(data.mid, { status: false, dir: [], message: error.message });
        }
    })
    socket.on('myid', (id) => {
        console.log(id);
    })
    socket.on('disconnect', () => {
        console.log('Disconnected');
    })
    socket.on('SYSTEM_DETAILS', async (data: string) => {
        let disk: any;
        let sysDetails: SysDetails
        if (platform() == 'win32') {
            sysDetails = {
                operatingSys: platform(),
                hostName: hostname(),
                platform: platform(),
                ostype: type(),
                release: release(),
                arch: arch(),
                homeDir: homedir(),
                version: version(),
                totalSpace: `512 GB`,
                free: `250 GB`,
                available: '262 GB'
            };
        } else {
            sysDetails = {
                operatingSys: platform(),
                hostName: hostname(),
                platform: platform(),
                ostype: type(),
                release: release(),
                arch: arch(),
                homeDir: homedir(),
                version: version(),
                totalSpace: `512 GB`,
                free: `250 GB`,
                available: '262 GB'
            };
            console.log(sysDetails);
        }

        socket.emit(data, sysDetails);
    })


    socket.on('DOWNLOAD_FILE_REQUEST', async (data: { mid: string, wid: string, path: PathLike }) => {

        if (existsSync(data.path)) {
            var filearray = data.path.toString().split('/');
            var fileName = filearray[filearray.length - 1];
            socket.emit(data.wid, { filename: fileName + '.zip', data: data })
            try {
                socket.on('START' + data.mid, async () => {
                    let fileState = await fs.stat(data.path);
                    const archive = archiver('zip', {
                        zlib: { level: 9 } // Sets the compression level.
                    });
                    if (fileState.isFile()) {
                        archive.file(data.path.toString(), { name: fileName });
                        archive.on('data', (chunk) => {
                            socket.emit(data.mid, { status: true, data: chunk });
                        })
                        archive.on('finish', () => {
                            socket.emit(data.mid, { status: true, end: true, filename: fileName + '.zip' });
                        })
                        archive.on('error', (err) => {
                            socket.emit(data.mid, { status: true, end: true, filename: fileName + '.zip' });
                        })
                        archive.finalize();
                    } else {
                        archive.directory(data.path.toString(), false);
                        archive.on('data', (chunk) => {
                            socket.emit(data.mid, { status: true, data: chunk });
                        })
                        archive.on('finish', () => {
                            socket.emit(data.mid, { status: true, end: true, filename: fileName + '.zip' });
                        })
                        archive.on('error', (err) => {
                            socket.emit(data.mid, { status: true, end: true, error: true, filename: fileName + '.zip', errorData: err });
                        })
                        archive.finalize();
                    }
                });
            } catch (error) {
                return socket.emit(data.mid, { status: false, message: 'This path is not a file' });
            }

        } else {
            return socket.emit(data.mid, { status: false, message: 'This path is not a file' });
        }



    });



    socket.on('DELETE_FILE_REQUEST', async ({ cb, path }) => {
        try {
            if (existsSync(path)) {

                if ((await fs.stat(path)).isDirectory()) {
                    await fs.rmdir(path, { recursive: true });
                    socket.emit(cb, { status: true, path: path, message: "Folder with path [ " + path + " ]" + " is deleted successfully. " });
                }
                else {
                    await fs.unlink(path);
                    socket.emit(cb, { status: true, path: path, message: "File with path [ " + path + " ] is deleted successfully.." });
                }

            } else {
                socket.emit(cb, { status: false, path: path, message: "This path is not exist" });
            }
        } catch (error: any) {
            socket.emit(cb, { status: false, path: path, error: error.message });
        }
    });

    socket.on('RECIEVE_FILES', async (data: { filename: string, cb: string, resId: string, path: string }) => {
        try {
            if (existsSync(data.path)) {
                if ((await fs.stat(data.path)).isDirectory()) {
                    let stream = createWriteStream(data.path + '/' + data.filename, { encoding: 'base64' });
                    let id = uuidV4();
                    console.log('Stream created');

                    socket.on(id.toString(), ({ data, cb, status, error }) => {
                        if (status == true) {
                            socket.removeAllListeners(id);
                            stream.close();
                            socket.emit(cb, { status: true, message: 'path  is uploaded to local machine' });
                        } else if (status == false) {
                            socket.emit(cb, { status: false, message: error.toString() });
                        } else {
                            stream.write(data);
                        }
                    })


                    socket.emit(data.cb, { id: id.toString() });
                } else {
                    socket.emit(data.resId, { status: false, path: data.path, message: 'path [' + data.path + '] is a file type not a directory for upload' });
                }
            } else {
                socket.emit(data.resId, { status: false, path: data.path, message: 'This path not exist on local pc' });
            }
        } catch (error: any) {
            socket.emit(data.resId, { status: false, path: data.path, message: error.message });
        }
    });


    socket.on('REQUEST_FROM_SCREEN_SHOT', async ({ id }) => {
        screensHot.all().then((data) => {
            console.log(data.length);
            socket.emit(id, data);
        })
    });
}


type Files = {
    name: string;
    isFile: Boolean,
}

type RDIrData = {
    path: string;
    mid: string;
    hidden: string;
}

type DiskUsage = {
    available: number;
    free: number;
    total: number;
}

type SysDetails = {
    operatingSys: string;
    hostName: string;
    platform: string;
    ostype: string;
    release: string;
    arch: string;
    homeDir: string;
    version: string;
    totalSpace: string,
    free: String,
    available: string,
}
