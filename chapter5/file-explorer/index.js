var fs = require('fs'),//导入fs模块
	stdin = process.stdin,
	stdout = process.stdout;
fs.readdir(process.cwd(), function (err, files) {//读取当前工作目录文件
	console.log('');

	if (!files.length) {
		return console.log('  \033[31m No files to show!\033[39m\n');	
	}

	console.log('  Select which file or directory you want to see\n');
	var stats = [];//用来保存每个stat的数据
	function file (i) {
		var filename = files[i];

		fs.stat(__dirname + '/' + filename, function (err, stat) {//给出文件或目录的元数据
			stats[i] = stat;
			if (stat.isDirectory()) {
				console.log('  ' + i + '  \033[36m' + filename + '/\033[39m');
			} else {
				console.log('  ' + i + '  \033[90m' + filename + '\033[39m');
			}

			i++;
			if (i === files.length) {
				read();
			} else {
				file(i);
			}
		});
	}
	//当文件名读取完毕后，获取用户输入
	function read () {
		console.log('');
		stdout.write('  \033[33mEnter your choice: \033[39m');
		stdin.resume();//等待用户输入
		stdin.setEncoding('utf8');

		stdin.on('data', option);
	}
	//读取用户输入数据后的回调函数
	function option (data) {
		var filename = files[Number(data)]
		if (!filename) {
			stdout.write('  \033[31mEnter your choice: \033[39m');
		} else {
			stdin.pause();
			if (stats[Number(data)].isDirectory()) {
				fs.readdir(__dirname + '/' + filename, function (err, files) {
					console.log('');
					console.log('  (' + files.length + ' files)');
					files.forEach( function(element) {
						console.log('    -  ' + element);
					});
					console.log('');
				});
			} else {
				fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {//读取文件
				console.log('');
				console.log('\033[90m' + data.replace(/(.*)/g, '    $1') + '\033[39m');//给文件开头加上空格
				});
			}			
		}
	}

	file(0);
});

