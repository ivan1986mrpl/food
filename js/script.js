
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
// ======================================






});