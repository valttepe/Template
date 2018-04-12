'use strict';
let categories;

const openModal = (item) => {
    console.log(item._id);
    // Get the modal elements
    const image = document.querySelector('#imageholder');
    const title = document.querySelector('#titleholder');
    const detail = document.querySelector('#detailholder');

    const modal = document.querySelector('#myModal');

    console.log(modal);

    // add data to elements
    image.src = 'images/' + item.image;
    title.innerText = item.title;
    detail.innerText = item.time;

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName('close')[0];

    // Get <button> element that opens edit page.
    const edit = document.querySelector('#edit-btn');

    // When the user clicks edit btn.
    edit.addEventListener('click', (evt) => {
        console.log('edit button clicked');
        window.location.href = 'edit.html?id=' + item._id;
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', (evt) => {
        modal.style.display = 'none';
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (evt) => {
        if (evt.target == modal) {
            modal.style.display = 'none';
        }
    });

    // jQuery code to open modal. Did find solution above without using this.
    // $('#myModal').modal();

    modal.style.display ='block';
};

// Pictures from the array
const pictures = (picArray) => {
    for (let item of picArray) {
        // create elements
        const column = document.createElement('div');
        const cardbody = document.createElement('div');
        const img = document.createElement('img');
        const title = document.createElement('h4');
        // const detail = document.createElement('p');
        const category = document.createElement('p');
        const button = document.createElement('a');
        // add data to elements
        img.src = 'images/' + item.thumbnail;
        title.innerText = item.title;
        // detail.innerText = item.time;
        category.innerText = 'Tags: ' + item.category;
        button.innerText = 'Details';

        // add required classes
        column.classList.add('col-sm-4');
        column.classList.add('card');
        column.classList.add('card-padding');
        cardbody.classList.add('card-body');
        title.classList.add('card-title');
        category.classList.add('card-text');
        img.classList.add('img-fluid');
        img.classList.add('card-img-top');
        button.classList.add('btn');
        button.classList.add('btn-primary');

        // id for the element. Needed in sorting
        column.setAttribute('id', item.category);
        // add data to container element
        column.appendChild(img);
        cardbody.appendChild(title);
        // column.appendChild(detail);
        cardbody.appendChild(category);
        cardbody.appendChild(button);
        column.appendChild(cardbody);


        // Click event listener for opening modal
        column.addEventListener('click', (evt) => {
            openModal(item);
        });

        // Put whole container to existing html element
        document.querySelector('#row-content').appendChild(column);
    }
};

fetch('/get-cats')
    .then( (res) => {
        return res.json();
    })
    .then( (result) => {
        console.log(result);
        pictures(result);
        const categorylist = result.map( (item) => {
            return item.category;
        });
        categories = new Set(categorylist);
    }
);

const catForm = document.querySelector('#add-cat');
catForm.addEventListener( 'submit', (evt) => {
    evt.preventDefault();
    const fData = new FormData(evt.target);
    /*
    // Check that formdata has values
    for (let value of fData.values()) {
        console.log(value);
    }
    */
    const settings = {
        method: 'post',
        body: fData,
    };
    // First then return must return promise
    // next is for using response data.
    fetch('/post-cat', settings)
        .then( (response) => {
            return response.json();
        }).then( (result) => {
            console.log(result);
            // window.location.replace('/');
        }
    );
});
