const editor = document.getElementById("editor");
const saveArticleForm = document.getElementById("save-article-form");

saveArticleForm.addEventListener("submit", function (e) {
   console.log(e)
   e.preventDefault();
   tinymce.activeEditor.execCommand('mceSave');
});

