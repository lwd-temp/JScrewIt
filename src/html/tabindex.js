/* eslint-env browser */

function hasTabindex(element)
{
    var result = element.hasAttribute('tabindex');
    return result;
}

function removeTabindex(element)
{
    'use strict';

    element.removeAttribute('tabindex');
}

function setTabindex(element)
{
    'use strict';

    element.setAttribute('tabindex', 0);
}
