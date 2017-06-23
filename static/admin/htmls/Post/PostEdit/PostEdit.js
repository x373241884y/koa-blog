PostEditCtrl.$inject = ["$scope", "$remote", "$routeParams"];
function PostEditCtrl($scope, $remote, $routeParams) {
	$scope.$category = {};
	$scope.$tag = {};
	$scope.multipleCategory = {};
	$scope.multipleTag = {};
	$scope.multipleCategory.selectedCategoryWithGroupBy = [];
	$scope.multipleTag.selectedTagWithGroupBy = [];
	$scope.startup = function () {
		if ($routeParams.PostId) {
			$scope.PostId = $routeParams.PostId;
			$scope.editFlag = true;
			var pargs = {
				post_id: $scope.PostId
			};
			$remote.post("admin/getPost.do", pargs, function (data) {
				setTimeout(function () {
					$scope.post_title = data.post_title;
					$scope.post_status = data.post_status;
					if (data.categoryList) {
						$scope.multipleCategory.selectedCategoryWithGroupBy = data.categoryList.map(function (temp) {
							return temp.term_taxonomy_id;
						});
					}
					if (data.tagList) {
						$scope.multipleTag.selectedTagWithGroupBy = data.tagList.map(function (temp) {
							return temp.term_taxonomy_id;
						});
					}
					$scope.term_id2 = data.term_id2;
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
					$scope.$apply();
				});
			});
		}
		$remote.post("admin/getAllCategory.do", {}, function (data) {
			$scope.allCategory = data;
		});
		$remote.post("admin/getAllTag.do", {}, function (data) {
			$scope.allTag = data;
		});

	};

	$scope.postEdit = function () {
		var post_content = $("#post_content").val();
		if (!post_content) {
			$scope.$alert({
				title: "错误！",
				content: "请填写文章内容！"
			});
			return false;
		}
		var pargs = {
			post_title: $scope.post_title,
			termRelations:[].concat($scope.multipleCategory.selectedCategoryWithGroupBy).concat($scope.multipleTag.selectedTagWithGroupBy),
			post_content: post_content,
			post_status: $scope.post_status
		};
		pargs.post_id = $scope.PostId;
		$remote.post("admin/updatePost.do", pargs, function (data) {
			if (data.success == "ok") {
				$scope.$alert({
					title: "修改成功！",
					content: "修改文章成功！",
					ok: function () {
						$scope.routeRefresh();
					}
				});
			}
		});

	};
}