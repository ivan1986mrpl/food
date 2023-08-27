
window.addEventListener('DOMContentLoaded', () => {//(назначение большого глобального обработчика события на всю страницу)

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
});