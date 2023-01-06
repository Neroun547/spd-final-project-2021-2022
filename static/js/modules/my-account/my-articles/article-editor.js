tinymce.init({
    selector: 'textarea#editor',
    skin: 'bootstrap',
    plugins: 'lists, link, image, media, save',
    toolbar: 'h1 h2 bold italic strikethrough blockquote bullist numlist',
    menubar: false,
    save_onsavecallback: async (e) => {
        const title = document.getElementById("article-title-input").value;
        const theme = document.getElementById("article-theme-input").value;
        const content = e.contentDocument.body.innerHTML;

        const api = await fetch("/my-articles/write-article-with-html", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                theme: theme,
                title: title,
                content: content
            })
        });
        const response = await api.json();
        window.location.href = response.message;
    }
});