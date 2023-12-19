window.addEventListener("load", function() {
    document.querySelector(".preloader").classList.add("opacity-0");
    setTimeout(function() {
        document.querySelector(".preloader").style.display = "none";

        // Tìm nút bộ lọc mặc định bằng cách chọn nút có giá trị "data-filter" là "web-design" (hoặc giá trị mặc định mà bạn muốn)
        const defaultFilterBtn = filterContainer.querySelector('[data-filter="web-design"]');

        if (defaultFilterBtn) {
            // Nếu tìm thấy nút bộ lọc mặc định, đánh dấu nó là "active"
            defaultFilterBtn.classList.add("active");

            // Lấy giá trị "data-filter" của nút bộ lọc mặc định
            const defaultFilterValue = defaultFilterBtn.getAttribute("data-filter");

            // Lặp qua tất cả các mục trong danh sách portfolio và ẩn các mục không khớp với bộ lọc mặc định
            for (let k = 0; k < totalPortfolioItem; k++) {
                const itemCategory = portfolioItems[k].getAttribute("data-category");
                if (defaultFilterValue !== "all" && defaultFilterValue !== itemCategory) {
                    portfolioItems[k].classList.add("hide");
                }
            }
        }
    }, 1000);
});


// Portfolio Item Filter
const filterContainer = document.querySelector(".portfolio-filter"),
    filterBtns = filterContainer.children,
    totalFilterBtn = filterBtns.length,
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    totalPortfolioItem = portfolioItems.length;

for (let i = 0; i < totalFilterBtn; i++) {
    filterBtns[i].addEventListener("click", function() {
        filterContainer.querySelector(".active").classList.remove("active")
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");
        for (let k = 0; k < totalPortfolioItem; k++) {
            if (filterValue === portfolioItems[k].getAttribute("data-category")) {
                portfolioItems[k].classList.remove("hide");
                portfolioItems[k].classList.add("show");
            } else {
                portfolioItems[k].classList.remove("show")
                portfolioItems[k].classList.add("hide")
            }

        }

    })
}



// Portfolio Lightbox

// const lightbox = document.querySelector(".lightbox"),
//     lightboxImg = lightbox.querySelector(".lightbox-img"),
//     lightboxClose = lightbox.querySelector(".lightbox-close"),
//     lightboxText = lightbox.querySelector(".caption-text"),
//     lightboxCounter = lightbox.querySelector(".caption-counter");
// let itemIndex = 0;

// for (let i = 0; i < totalPortfolioItem; i++) {
//     portfolioItems[i].addEventListener("click", function() {
//         itemIndex = i;
//         changeItem();
//         toggleLightbox();
//     })
// }

// function nextItem() {
//     if (itemIndex === totalPortfolioItem - 1) {
//         itemIndex = 0
//     } else {
//         itemIndex++
//     }
//     changeItem()
// }

// function prevItem() {
//     if (itemIndex === 0) {
//         itemIndex = totalPortfolioItem - 1
//     } else {
//         itemIndex--;
//     }
//     changeItem()
// }
// //Body.......
// function toggleLightbox() {
//     lightbox.classList.toggle("open");
// }

function changeItem() {
    // imgSrc = portfolioItems[itemIndex].querySelector(".portfolio-img img").getAttribute("src");
    // lightboxImg.src = imgSrc;
    // lightboxText.innerHTML = portfolioItems[itemIndex].querySelector("h4").innerHTML;
    // lightboxCounter.innerHTML = (itemIndex + 1) + " of " + totalPortfolioItem;
}

// Close Lightbox
// lightbox.addEventListener("click", function(event) {
//     if (event.target === lightboxClose || event.target === lightbox) {
//         toggleLightbox();
//     }

// })


// Aside Navbar

const nav = document.querySelector(".nav"),
    navList = nav.querySelectorAll("li"),
    totalNavList = navList.length,
    allSection = document.querySelectorAll(".section"),
    totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function() {
        // remove back secion
        removeBackSectionClass();

        for (let i = 0; i < totalSection; i++) {
            allSection[i].classList.remove("back-section");
        }


        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                // add back section
                addBackSectionClass(j);
            }
            navList[j].querySelector("a").classList.remove("active")
        }
        this.classList.add("active")
        showSection(this);
        if (window.innerWidth < 1200) {
            asideSectionTogglerBtn();
        }
    })

}

function removeBackSectionClass() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section")
    }
}

function addBackSectionClass(num) {
    allSection[num].classList.add("back-section");
}

function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active");
    }
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add("active")

}

function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target === navList[i].querySelector("a").getAttribute("href").split("#")[1]) {
            navList[i].querySelector("a").classList.add("active");
        }
    }
}

// document.querySelector(".hire-me").addEventListener("click", function() {
//     const sectionIndex = this.getAttribute("data-section-index");
//     console.log(sectionIndex)
//     showSection(this);
//     updateNav(this);
//     removeBackSectionClass();
//     addBackSectionClass(sectionIndex)
// })

const navTogglerBtn = document.querySelector(".nav-toggler"),
    aside = document.querySelector(".aside");
navTogglerBtn.addEventListener("click", asideSectionTogglerBtn)

function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.toggle("open");
    }
}

const audioUploadInput = document.getElementById('audio-upload');
const selectedFileDiv = document.getElementById('selected-file');
const audioPlayer = new Audio();
let audioLoaded = false;
// Gắn sự kiện change cho input
audioUploadInput.addEventListener('change', function() {
    const selectedFile = this.files[0];

    if (selectedFile) {
        // Hiển thị tên tệp đã chọn
        selectedFileDiv.textContent = `Tệp đã chọn: ${selectedFile.name}`;

        audioPlayer.src = URL.createObjectURL(selectedFile);
        // Thực hiện xử lý tải lên tại đây (ví dụ: gửi tệp lên máy chủ)
        // Bạn có thể sử dụng XMLHttpRequest hoặc fetch API để thực hiện việc này.
        audioLoaded = true;
    } else {
        selectedFileDiv.textContent = 'Không có tệp nào được chọn.';
        audioLoaded = false;
    }
});

// Đoạn mã xử lý khi nút "Tải lên âm thanh" được nhấp (nếu cần)
const uploadButton = document.getElementById('upload-button');
uploadButton.addEventListener('click', function() {

    audioUploadInput.click(); // Khi nhấp vào nút, gọi sự kiện click cho input âm thanh
});

// Đoạn mã xử lý khi nút "Phát" được nhấp
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', function() {
    if (audioLoaded) {
        audioPlayer.play();
    }
});

// Đoạn mã xử lý khi nút "Tạm dừng" được nhấp
const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function() {
    audioPlayer.pause();
});

const resultButton = document.getElementById('result-button');
const langradio = document.getElementsByName('language');

resultButton.addEventListener('click', function() {
    if (audioLoaded) {
        const selectedAudioFile = audioUploadInput.files[0];
        if (selectedAudioFile) {
            // Bạn có thể sử dụng selectedAudioFile ở đây để thực hiện công việc mong muốn
            console.log('Selected Audio File:', selectedAudioFile);
        } else {
            alert('Hãy chọn một file âm thanh.');
            return;
        }
        // Tạo FormData để gửi dữ liệu audio
        const formData = new FormData();
        formData.append('audio_file', selectedAudioFile);
        const xhr = new XMLHttpRequest();
        langradio.forEach(radio => {
            // Kiểm tra xem radio nào được check
            if (radio.checked) {
                console.log('Đã chọn ngôn ngữ:', radio.value);
                if (radio.value == 'vietnamese') {
                    xhr.open('POST', '/get_waveform_image/', true);
                } else {
                    xhr.open('POST', '/get_result/', true);
                }
                // Nếu muốn thực hiện các hành động khác với ngôn ngữ được chọn ở đây
            }
        });
        // xhr.open('POST', '/get_waveform_image/', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.converted) {
                    const imagePath = `/static/images/result_human.png?timestamp=${new Date().getTime()}`;
                    // document.getElementById('my-form').innerHTML = `<img src="${imagePath}" alt="Waveform">`;
                    const imageElement = document.getElementById('image-result');
                    imageElement.src = imagePath;
                    imageElement.style.display = 'block';


                } else {
                    const imagePath = `/static/images/result_ai.png?timestamp=${new Date().getTime()}`;
                    // document.getElementById('my-form').innerHTML = `<img src="${imagePath}" alt="Waveform">`;
                    const imageElement = document.getElementById('image-result');
                    imageElement.src = imagePath;
                    imageElement.style.display = 'block';

                }
            }
        };
        document.getElementById('waveform-container').style.display = 'flex';
        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        likeButton.style.display = 'inline-block';
        dislikeButton.style.display = 'inline-block';
        resultButton.style.display = 'none';
        langradio.forEach(radio => {
            radio.style.display = 'none';
        });
        const langViButton = document.getElementById('lang_vi');
        const langEnButton = document.getElementById('lang_en');

        langViButton.parentElement.style.display = 'none';
        langEnButton.parentElement.style.display = 'none';
        xhr.send(formData);
    }
});

const LikeButton = document.getElementById('like-button');
LikeButton.addEventListener('click', function() {

    if (audioLoaded) {
        const selectedAudioFile = audioUploadInput.files[0];
        if (selectedAudioFile) {
            // Bạn có thể sử dụng selectedAudioFile ở đây để thực hiện công việc mong muốn
            console.log('Selected Audio File:', selectedAudioFile);
        } else {
            alert('Hãy chọn một file âm thanh.');
            return;
        }

        // audio_path = os.path.join(settings.STATICFILES_DIRS[0], 'audio', selectedAudioFile.name, statuss)
        const formData = new FormData();
        formData.append('audio_file', selectedAudioFile);
        formData.append('key_name', '1');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/down_audio/', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.converted) {

                    alert('done!');
                } else {

                    alert("Try later");
                }
            }
        };
        document.getElementById('waveform-container').style.display = 'flex';
        const imageResult = document.getElementById('image-result');

        // Để ẩn ảnh
        imageResult.style.display = 'none';

        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        likeButton.style.display = 'none';
        dislikeButton.style.display = 'none';
        resultButton.style.display = 'inline-block';
        langradio.forEach(radio => {
            radio.style.display = 'inline-block';
        });
        const langViButton = document.getElementById('lang_vi');
        const langEnButton = document.getElementById('lang_en');

        langViButton.parentElement.style.display = 'inline-block';
        langEnButton.parentElement.style.display = 'inline-block';
        xhr.send(formData);
    }
});

const LDislikeButton = document.getElementById('dislike-button');
LDislikeButton.addEventListener('click', function() {

    if (audioLoaded) {
        const selectedAudioFile = audioUploadInput.files[0];
        if (selectedAudioFile) {
            // Bạn có thể sử dụng selectedAudioFile ở đây để thực hiện công việc mong muốn
            console.log('Selected Audio File:', selectedAudioFile);
        } else {
            alert('Hãy chọn một file âm thanh.');
            return;
        }

        // audio_path = os.path.join(settings.STATICFILES_DIRS[0], 'audio', selectedAudioFile.name, statuss)
        const formData = new FormData();
        formData.append('audio_file', selectedAudioFile);
        formData.append('key_name', '0');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/down_audio/', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.converted) {

                    alert('done!');
                } else {

                    alert("Try later");
                }
            }
        };
        document.getElementById('waveform-container').style.display = 'flex';
        const imageResult = document.getElementById('image-result');

        // Để ẩn ảnh
        imageResult.style.display = 'none';

        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        likeButton.style.display = 'none';
        dislikeButton.style.display = 'none';
        resultButton.style.display = 'inline-block';
        langradio.forEach(radio => {
            radio.style.display = 'inline-block';
        });
        const langViButton = document.getElementById('lang_vi');
        const langEnButton = document.getElementById('lang_en');

        langViButton.parentElement.style.display = 'inline-block';
        langEnButton.parentElement.style.display = 'inline-block';
        xhr.send(formData);
    }
});

// Old Upload image 
// const selectImage = document.querySelector('.select-image');
// const inputFile = document.querySelector('#file');
// const imgArea = document.querySelector('.img-area');
// const dropArea = document.querySelector('#drop-area')
// const containerFile = document.querySelector(".container-file") 


// selectImage.addEventListener('click', function () {
// 	inputFile.click();
// })

// inputFile.addEventListener('change', uploadImage)

// function uploadImage() {
//     const image = inputFile.files[0]
// 	if(image.size < 2000000) {
// 		const reader = new FileReader();
// 		reader.onload = ()=> {
// 			const allImg = imgArea.querySelectorAll('img');
// 			allImg.forEach(item=> item.remove());
// 			const imgUrl = reader.result;
// 			const img = document.createElement('img');
// 			img.src = imgUrl;
// 			imgArea.appendChild(img);
// 			imgArea.classList.add('active');
// 			imgArea.dataset.img = image.name;

    
// 		}
// 		reader.readAsDataURL(image);
// 	} else {
// 		alert("Image size more than 2MB");
// 	}
// }

// dropArea.addEventListener("dragover", function (e) {
//     e.preventDefault()
// })

// dropArea.addEventListener("drop", function (e) {
//     e.preventDefault()
//     inputFile.files = e.dataTransfer.files 
//     uploadImage()
// })

// const showResult = document.querySelector('.show-result')
// const imageResult = document.querySelector('.image-result')

// showResult.addEventListener('click', function(e) {
//     e.preventDefault() 

//     // Kiểm tra xem đã có ảnh được tải lên chưa
//     if (imgArea.classList.contains('active')) {
//         const imageUrl = imgArea.querySelector('img').src

//         sendImageToServer(imageUrl) 
//     } else {
//         alert('Please upload an image first') 
//     }
// })

// function sendImageToServer(imageUrl) {
//     const apiUrl = '/predict_image/' 

//     const formData = new FormData() 
//     formData.append('image', inputFile.files[0]) 
//     console.log(formData);

//     // Send POST request 
//     fetch(apiUrl, {
//         method: 'POST',
//         body: formData,
//     })
//     .then(response => response.json()) 
//     .then(data => {
//         console.log(data); 
//         // alert("Image sent successfully") 
//         if ('result_image' in data) {
//             const imgElement = new Image()
//             imgElement.src = `data:image/png;base64, ${data.result_image}`
//             imgElement.alt = 'Result image'
//             while (imageResult.firstChild) {
//                 imageResult.removeChild(imageResult.firstChild) 
//             }

//             imageResult.append(imgElement) 

//         }
//     })
//     .catch(error => {
//         console.log(error); 
//     })
// }

const wrapper = document.querySelector(".wrapper");
const fileName = document.querySelector(".file-name");
const defaultBtn = document.querySelector("#default-btn");
const customBtn = document.querySelector("#custom-btn");
const cancelBtn = document.querySelector("#cancel-btn i");
const img = document.querySelector(".img");

let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
customBtn.addEventListener('click', function(e) {
    e.preventDefault() 
    defaultBtn.click()
})

defaultBtn.addEventListener("change", uploadImage);

function uploadImage() {
    const file = defaultBtn.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(){
        const result = reader.result;
        img.src = result;
        wrapper.classList.add("active");
        }
        cancelBtn.addEventListener("click", function(){
            img.src = "";
            wrapper.classList.remove("active");
        })
        reader.readAsDataURL(file);
    }
    if(defaultBtn.value){
        let valueStore = defaultBtn.value.match(regExp);
        fileName.textContent = valueStore;
    }
}

const showResult = document.querySelector('.show-result')
const imageResult = document.querySelector('.image-result')
const imageContainer = document.querySelector('.image-result .wrapper .image')
const label = document.querySelector('.label')

showResult.addEventListener('click', function(e) {
    e.preventDefault() 
    if (wrapper.classList.contains('active')) {
        const imageUrl = img.src

        sendImageToServer(imageUrl)
    }
})

function sendImageToServer(imageUrl) {
    const apiUrl = '/predict_image_gradcam/' 
    const formData = new FormData() 
    formData.append('image', defaultBtn.files[0]) 
    console.log(formData);

    // Send POST request 
    fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json()) 
    .then(data => {
        console.log(data); 
        // alert("Image sent successfully") 
        if ('result_image' in data) {
            const imgElement = new Image()
            imgElement.src = `data:image/png;base64, ${data.result_image}`
            imgElement.alt = 'Result image'
            while (imageContainer.firstChild) {
                imageContainer.removeChild(imageContainer.firstChild) 
            }

            imageContainer.append(imgElement) 
            const wrapper = document.querySelector('.image-result .wrapper') 
            wrapper.classList.add('active')

        }

        if ('prediction' in data) {
            const predictionElement = document.createElement('h3') 
            predictionElement.textContent = `${data.prediction} with confidence score : ${(parseFloat(data.confidence)*100).toFixed(2)}`
            while (label.firstChild) {
                label.removeChild(label.firstChild) 
            }

            label.append(predictionElement)
        }
    })
    .catch(error => {
        console.log(error); 
    })
}

wrapper.addEventListener('dragover', function(e) {
    e.preventDefault()
})

wrapper.addEventListener('drop', function(e) {
    e.preventDefault()
    defaultBtn.files = e.dataTransfer.files
    uploadImage()
})