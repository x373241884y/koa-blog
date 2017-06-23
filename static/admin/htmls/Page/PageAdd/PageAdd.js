PageAddCtrl.$inject = ["$scope", "$remote"];
function PageAddCtrl($scope, $remote) {
	$scope.startup = function () {
		$("#post_content").val('');
		var testEditor = editormd("editormd", {
			width: "auto",
			height: 640,
			syncScrolling: "single",
			path: "lib/plugins/editor/",
			theme: "default",
			previewTheme: "default",
			editorTheme: "default",
			codeFold: true,
			//syncScrolling : false,
			saveHTMLToTextarea: true,    // 保存 HTML 到 Textarea
			searchReplace: true,
			watch: false,                // 关闭实时预览
			htmlDecode: "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
			//toolbar  : false,             //关闭工具栏
			//previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
			taskList: true,
			toolbarIcons: function () {
				// Or return editormd.toolbarModes[name]; // full, simple, mini
				return ["undo", "redo", "|", "bold", "hr", "||", "watch", "fullscreen", "preview", "testIcon"];
			},
			imageUpload: true,
			imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
			imageUploadURL: "./php/upload.php",
			onfullscreen: function () {
				console.log('fullscreen');
				$("body").addClass("editor-fullscreen");
				$("#subbtn").hide();
			},

			onfullscreenExit: function () {
				console.log('onfullscreenExit');
				$("body").removeClass("editor-fullscreen");
				$("#subbtn").show();
			}
		});
	};

	$scope.pageNew = function () {
		var post_content = $("#post_content").val();
		if (!post_content) {
			$scope.$alert({
				title: "错误！",
				content: "请填写文章内容！"
			});
		}
		var pargs = {
			post_title: $scope.post_title,
			post_content: post_content,
			post_status: $scope.post_status
		};
		$remote.post("admin/addPage.do", pargs, function (data) {
			if (data.success == "ok") {
				$scope.$alert({
					title: "添加成功！",
					content: "添加页面成功！",
					ok: function () {
						$scope.routeRefresh();
					}
				});
			}
		});

	};
}