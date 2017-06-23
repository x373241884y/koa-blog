PageEditCtrl.$inject = ["$scope", "$remote","$routeParams"];
function PageEditCtrl($scope, $remote,$routeParams) {
	$scope.startup = function () {
		$scope.PostId = $routeParams.PostId;
		var pargs = {
			post_id: $scope.PostId
		};
		$remote.post("admin/getPage.do",pargs,function(data) {
			$scope.post_title = data.post_title;
			$scope.post_status = data.post_status;
			// $("#post_content").val(data.post_content);
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
				value:data.post_content,
				onfullscreenExit: function () {
					console.log('onfullscreenExit');
					$("body").removeClass("editor-fullscreen");
					$("#subbtn").show();
				}
			});
		});


	};

	$scope.pageEdit = function () {
		var post_content = $("#post_content").val();
		var pargs = {
			post_id:$scope.PostId,
			post_title: $scope.post_title,
			post_content: post_content,
			post_status: $scope.post_status
		};
		$remote.post("admin/updatePage.do", pargs, function (data) {
			if (data.success == "ok") {
				$scope.$alert({
					title: "修改成功！",
					content: "修改页面成功！",
					ok: function () {
						$scope.routeRefresh();
					}
				});
			}
		});

	};
}