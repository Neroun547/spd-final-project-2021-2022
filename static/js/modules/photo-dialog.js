export function openDialogActions(src, id, delBtn=true) {
    if(delBtn) {
        Metro.dialog.create({
            content: `<div><img src=${src}/></div>`,
            actions: [
                {
                    caption: "Delete",
                    cls: "js-dialog-close alert",
                    onclick: function(){

                        if(confirm("Do you want delete this photo ?")) {
                            fetch(`/my-photo/delete-photo/${id}`, {
                                method: "DELETE"
                            });
                            document.getElementById(id).remove();  
                            
                            throw new Error("Element was deleted ...");
                        } 
                    }
                },
                {
                    caption: "Close",
                    cls: "js-dialog-close close"
                }
            ],
            overlayClickClose: true
        });
    }

    Metro.dialog.create({
        content: `<div><img src=${src}/></div>`,
        actions: [
            {
                caption: "Close",
                cls: "js-dialog-close close"
            }
        ],
        overlayClickClose: true
    });
};