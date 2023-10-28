tinymce.init({
    selector: 'textarea#editor',
    skin: 'bootstrap',
    plugins: 'lists, link, image, media, save',
    toolbar: 'h1 h2 bold italic strikethrough blockquote bullist numlist',
    menubar: false,
    save_onsavecallback: async (e) => {
        const id = document.querySelector(".wrapper__editor").getAttribute("id");
        const content = e.contentDocument.body.innerHTML;

        const api = await fetch("/my-articles/edit-article/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: content
            })
        });
        const response = await api.json();
        window.location.href = response.message;
    }
});
