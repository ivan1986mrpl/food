
window.addEventListener('DOMContentLoaded', () => {//(назначение большого глобального обработчика события на всю страницу)

// ====================== TABS ================

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');//(получаем родителя табов, чтобы использовать делегирование событий)

    function hideTabContent() {//(функция, которая скрывает ненужные табы)
        tabsContent.forEach(item => {
            item.style.display = 'none';

            tabs.forEach(item => {
                item.classList.remove('tabheader__item_active');//(точку не ставим, метод и так для классов)
            });
        });//(т.к. tabsContent это псевдомассив, перебираем его через forEach и скрываем весь контент табов и удаляем класс активности)
    }

    function showTabContent(i = 0) {//(в стандарте es6 появилась возможность i назначать 0 элементом по умолчанию. Тогда если вызывать эту функцию без аргумента, подставится сразу 0 дефолтное значение вместо i)
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }//(функция, которая показывает табы. i = элемент, который надо показать и добавить ему класс активности)


    hideTabContent();
    //showTabContent(0);//(передаем вместо i первый таб. Так надо было делать до стандарта ES6)
    showTabContent();

    //(используя делегирование событий. назначаем событие клика)
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')) {//(если полльзователь кликнул в какой-то таб, мы определяем номер таб и вызываем функцию showTabContent(); с этим номером в аргументе. Перебираем все табы, которые лежат в псевдомассиве tabs и сравниваем. Если элемент, который кликнул пользователь совпадает с имеющимся на странице, то этот элемент по номеру показываем на странице)
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

// ====================== TIMER ================

    const deadline = '2023-09-31';//(перменная делайн, в нее помещаем дату в виде строки)

    function getTimeRemaining(endtime) {//(функция, которая определяет разницу между дедлайном и нашим сегодняшним временем)
        let days, hours, minutes, seconds;

        const t = Date.parse(endtime) - Date.parse(new Date());//(от нашей даты отнимаем количество маллисекунд, которое будет до конечного времени)

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor( (t/(1000*60*60*24)) ),//(оператор округления до ближайшего целого. (общее кол-во миллисек делим на кол-во мс в сутках))
            seconds = Math.floor( (t/1000) % 60 ),//(общее количество часов делим на 24 и выводим остаток от деления)
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );
        }

        return {
            'total': t,//(общее кол-во миллисекунд)
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {//(функция, которая обновляет таймер каждую секунду)
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {//(функция остановки таймера, если время вышло и идет в отрицательную сторону)
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

// ==================== MODAL ==================data-modal data-close

const modalTrigger = document.querySelectorAll('[data-modal]'),
      modal = document.querySelector('.modal'),
      modalCloseBtn = document.querySelector('[data-close]');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove("hide");
    document.body.style.overflow = 'hidden';//(чтобы не скролллился сайт при открытом окне)
    clearInterval(modalTimerId);//(если пользователь сам открыл окно, то setTimeout не будет его повторно открывать через ...секунд)
}

modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
}); 

function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {//(чтобы окно закрывалось по клику на подложку, а не на модальное окно)
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape'&& modal.classList.contains('show')) {//(В event есть свойство code, которое проверяет на какую клавишу нажал пользователь и у каждой клавиши есть свой код)
        closeModal();
    }
});//(событие 'keydown' вешается на документ и означает нажатие клавиши на клавиатуре)

//(чтобы модальное окно открывалось, когда пользователь долистает до конца страницы и через несколько секунд задержки)
const modalTimerId = setTimeout(openModal, 5000);//закоментировать,чтобы не выскакивало

function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {//(как только пользователь долистал до конца - 1 пиксель)
        openModal();
        window.removeEventListener('scroll', showModalByScroll);//(чтобы модалка выскакивала только один раз при скролле до конца страницы)
    }
}

window.addEventListener('scroll', showModalByScroll);
//====================================================
//=========== ИСПОЛЬЗУЕМ КЛАССЫ ДЛЯ КАРТОЧЕК  =======

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;//(rest оператор = массив)
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {//(конвертация из доллара в гривню)
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');//(создаем див)

            if (this.classes.length === 0) {//(если в массив с классами не передался не один класс, то перезаписываем в массив дефолтный класс menu__item и добавляем его элементу)
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML = `                
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>                
            `;//(создаем структуру)
            this.parent.append(element);//(помещаем на страницу)
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес New"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
        //'menu__item'//(пишем без точки впереди, потому что будет помещено в массив)
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное New"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум New”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();//(создаем объект, сразу на него на месте вызываем метод render. Если таким синтаксисом создавать его, то после того, как он отработает, он исчезнет, потому что мы нигде не сохраняем на него ссылок. Это удобно, когда нужно только одн раз его использовать)

    // =============== FORMS ===================(отправка данных с форм на сайте)

    const forms = document.querySelectorAll('form');//(получение всех форм на странице)

    const messege = {//(список всплывающих фраз)
        loading: 'Загрузка',
        success: 'Спасибо, скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...',
    };

    forms.forEach(item => {//(перебираем, чтобы под каждую форму подвязать функцию postData)
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {//(submit срабатывает каждый раз, как пытаемся отправить какую-то форму)
            e.preventDefault();//(отменяем стандартное поведение браузера, перезагрузку при отправке формы)

            const statusMessege = document.createElement('div');//(динамически добавляемый текстовый блок с всплывающим сообщением)
            statusMessege.classList.add('status');
            statusMessege.textContent = messege.loading;//(внутрь дива помещаем то сообщение, которое надо показать)
            form.append(statusMessege);//(помещаем на страницу)

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');//(метод, чтобы настроить этот запрос)

            request.setRequestHeader('Content-type', 'application/json');//(когда используем связку XMLHttpRequest и formData, заголовок устанавливать не нужно, он устанавливается автоматически. Если его установить, на сервере не получим данных. Еси отправляем данные в формате JSON, то устанавливаем заголовок 'application/json')
            const formData = new FormData(form);//(проверить, чтобы в верстке в теге input были прописаны атрибуты name и они были уникальны для каждого input)

            const object = {};//(чтобы объект formData превратить в формат JSON создаем переменную и ложим в нее пустой объект. Потом переберем formData при помощи цикла forEach и все данные внутри поместим в object. )
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);//(когда мы получили обычный объект, а не formData, используем конвертацию JSON)

            request.send(json);//(отправляем объект)

            request.addEventListener('load', () => {//(load = конечная загрузка нашего запроса)
                if (request.status === 200) {
                    console.log(request.response);//(не обязательно)
                    statusMessege.textContent = messege.success;
                    form.reset();//(очистка формы)
                    setTimeout(() => {//(чтобы удалить блок с сообщением)
                        statusMessege.remove();
                    }, 2000);
                } else {
                    statusMessege.textContent = messege.failure;
                }
            });
        });
    }//(при работе на локальном сервере надо сбрасывать кеш. на Виндовс это shift + F5)
//========================================================
});





