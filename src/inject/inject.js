waitForElementToDisplay("#shop_card_result", 1000);

function waitForElementToDisplay(selector, checkFrequencyInMs) { //Wait for result element to load
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
            run();
            async function run() {

                //Making ui changes
                actualresultcontainer = document.querySelector('#shop_card_result').parentElement.parentElement
                document.querySelector('#results__right__component').querySelector('[direction="column"]').style.margin = '40px 0px 0px 0px';
                document.querySelector('#verticals__left__component div').querySelector('[direction="column"]').style.margin = '40px 0px 0px 0px';
                document.querySelector('#verticals__left__component div').innerHTML += document.querySelector('#results__right__component').innerHTML
                rightcont = document.querySelector('#results__right__component')
                rightcont.innerHTML = ''
                loading(rightcont) //show loading animation
                container = document.querySelector('#search_container').parentElement.parentElement.parentElement.cloneNode(true);
                searchinput = container.querySelector('#search_input')
                resultcontainer = container.querySelector('#shop_card_result').parentElement.parentElement
                resultcontainer.style.height = window.getComputedStyle(actualresultcontainer).height
                resultcontainer.style.overflowY = 'scroll'
                resultcontainer.style.marginBottom = '46px'
                countertext = container.querySelector('#search_container').parentElement.parentElement.querySelector('div div span h3')
                loadingcounter = countertext.cloneNode(true)
                loadingcounter.innerText = '' //Clear counter text
                rightcont.appendChild(loadingcounter) //Append loading counter to show progress 

                elperscroll = 50 //Number of elements shown per scroll
                const urlParams = new URLSearchParams(window.location.search); //Get url params
                restaurantsjson = await fetch(`https://www.pedidosya.com.uy/mobile/v5/shopList?businessType=RESTAURANT&country=1&max=900000000&offset=0&point=${urlParams.get('lat')},${urlParams.get('lng')}&withFilters=true`).then(res => res.json());
                city = urlParams.get('city').toLowerCase()
                menus = {}
                elnumber = 0 //Set elements shown counter to 0
                await getMenus() //Get restaurant menus

                document.querySelector('#results__right__component').innerHTML = '' //Clear container after loading
                green = ['rgb(38, 130, 16)', 'rgb(217, 244, 217)']
                greenish = ['rgb(101, 125, 2)', 'rgb(235, 240, 202)']
                yellow = ['rgb(127, 115, 4)', 'rgb(246, 238, 206)']
                redish = ['rgb(253, 230, 203)', 'rgb(141, 102, 2)']
                redbtncolor = 'rgb(245, 47, 65)'
                svgpedido = '<svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="#ffffff" viewBox="0 0 16 16"><path d="M12.55 1.136c.64 0 1.2.445 1.2 1.057v11.635c0 .334-.222.61-.532.723a.922.922 0 01-.827-.098l-1.609-1.096-2.316 1.38a.924.924 0 01-.822.056l-.11-.055-2.317-1.381-1.608 1.096a.917.917 0 01-.708.132l-.12-.034c-.31-.114-.531-.39-.531-.723V2.193c0-.612.56-1.057 1.2-1.057zm0 1h-9.1c-.132 0-.2.054-.2.057v11.294l1.669-1.136a.5.5 0 01.45-.057l.087.041L8 13.851l2.544-1.516a.5.5 0 01.453-.03l.084.046 1.669 1.137V2.193a.253.253 0 00-.128-.051l-.072-.006zm-1.333 6.806l.1.008a.677.677 0 01.57.57l.007.1a.677.677 0 11-.782-.669l.105-.009zm-2.475.177a.5.5 0 01.09.992l-.09.008H4.5a.5.5 0 01-.09-.992l.09-.008h4.242zm2.475-2.298l.1.008a.677.677 0 01.57.569l.007.1a.677.677 0 11-.782-.668l.105-.009zm-2.828.177a.5.5 0 01.09.992l-.09.008H4.5a.5.5 0 01-.09-.992l.09-.008h3.889zM11.217 4.7l.1.007a.679.679 0 01.57.57l.007.1a.677.677 0 11-.782-.669l.105-.008zm-3.889.177a.5.5 0 01.09.992l-.09.008H4.5a.5.5 0 01-.09-.992l.09-.008h2.828z"></path></svg>'
                svgmap = '<svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="#ffffff" viewBox="0 0 16 16"><path d="M7.622.5c2.45.104 4.29 1.179 5.428 3.25.518.944.723 1.989.627 3.105-.09 1.045-.465 2.004-1.109 2.905l-.182.245L8.3 15.3c-.373.484-.926.512-1.324.092l-.082-.096-4.22-5.477a5.501 5.501 0 01-1.138-2.8c-.187-1.773.356-3.34 1.599-4.636C4.113 1.363 5.34.756 6.788.555L6.985.53l.251-.015L7.622.5zm-.036 1l-.452.023-.129.012-.359.056c-1.105.205-2.033.696-2.79 1.484-1.04 1.085-1.481 2.36-1.326 3.839.078.74.336 1.429.768 2.061l.17.235 4.13 5.361 3.998-5.18c.642-.826 1.004-1.684 1.085-2.622.08-.924-.087-1.771-.507-2.537-.922-1.68-2.353-2.564-4.322-2.716l-.266-.017zM7.57 3.7l.17.004c1.402.087 2.504 1.223 2.504 2.621a2.636 2.636 0 01-2.667 2.681c-1.478 0-2.668-1.181-2.67-2.634a2.681 2.681 0 012.495-2.668L7.57 3.7zm-.002 1l-.142.005a1.68 1.68 0 00-1.518 1.667c0 .898.742 1.634 1.67 1.634a1.64 1.64 0 001.666-1.672c0-.859-.665-1.557-1.53-1.629L7.568 4.7z"></path></svg>'
                svgrest = '<svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="#ffffff" viewBox="0 0 16 16"><path d="M12.858 1.5a.5.5 0 01.455.294l.328.73.353.81.202.487.105.267.082.221.058.177c.23.77-.162 1.611-.94 1.998L13.5 13a.5.5 0 01-.41.492L13 13.5H8.04c-.602 1.092-1.736 1.83-3.04 1.83-1.938 0-3.5-1.63-3.5-3.63 0-.988.38-1.885 1-2.54l-.001-2.62c-.851-.353-1.177-1.24-.92-2.14l.067-.209.043-.12.105-.272.131-.316L2 3.31l.266-.588.446-.94a.5.5 0 01.45-.282zM5 9.07c-1.376 0-2.5 1.173-2.5 2.63 0 1.457 1.124 2.63 2.5 2.63s2.5-1.173 2.5-2.63c0-1.457-1.124-2.63-2.5-2.63zm.034 1.163c.246 0 .45.176.492.41l.008.09v.529l.53.001a.5.5 0 01.09.992l-.09.008-.53-.001v.531a.5.5 0 01-.992.09l-.008-.09v-.531l-.53.001a.5.5 0 01-.09-.992l.09-.008.53-.001v-.53a.5.5 0 01.5-.5zm-.04-4.227l-.083.094c-.34.354-.797.557-1.355.594l-.057.001v1.724a3.41 3.41 0 011.315-.344L5 8.07c1.938 0 3.5 1.63 3.5 3.63 0 .275-.03.542-.085.8l4.084-.001v-5.8c-.616-.01-1.106-.238-1.447-.657l-.008-.01-.058.069c-.326.352-.757.556-1.28.593l-.179.006c-.58 0-1.045-.192-1.377-.552l-.062-.073-.072.08c-.316.32-.74.506-1.258.54L6.58 6.7c-.63 0-1.139-.208-1.507-.601l-.08-.093zm7.54-3.507H3.476l-.204.43-.203.44-.172.386-.141.333-.11.279a6.203 6.203 0 00-.08.224l-.025.085c-.166.577.084 1.024.825 1.024.633 0 .98-.28 1.149-.94.128-.502.843-.5.97.003.165.66.498.937 1.096.937.592 0 .9-.267 1.036-.917.111-.539.885-.528.981.013.116.649.392.904.93.904.552 0 .877-.277 1.057-.946.137-.507.863-.487.972.026.14.656.436.92.987.92.699 0 1.062-.516.939-.927a2.574 2.574 0 00-.052-.156l-.122-.323-.177-.43-.23-.535-.368-.83z"></path></svg>'
                searchinput.removeAttribute('disabled')
                searchinput.style.pointerEvents = 'auto' //Enable pointer events as this input is shown as disabled in pedidosya
                document.querySelector('#results__right__component').appendChild(container)
                container.querySelector('#search_container #search_input').placeholder = 'Buscar comida...'
                resultcontainer.innerHTML = '' //Limpiar resultados
                el7 = searchinput.parentElement.parentElement.nextElementSibling
                el7?.remove() //Remove ui elements of existing shop card to fit our needs
                el6 = container.querySelector('#search_container').parentElement.parentElement.querySelector('picture')
                el6?.remove() //Remove ui elements of existing shop card to fit our needs
                sort = 0
                countertext.innerText = 0 + ' comidas encontradas' //Texto cuantos restaurantes
                svgsort = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="70%" height="70%" fill="#ffffff" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 489.389 489.389" style="enable-background:new 0 0 489.389 489.389;" xml:space="preserve"<g><g><path d="M261.294,326.102c-8.3-7.3-21.8-6.2-29.1,2.1l-77,86.8v-346.9c0-11.4-9.4-20.8-20.8-20.8s-20.8,9.4-20.8,20.8v346.9    l-77-86.8c-8.3-8.3-20.8-9.4-29.1-2.1c-8.3,8.3-9.4,20.8-2.1,29.1l113.4,126.9c8.5,10.5,23.5,8.9,30.2,0l114.4-126.9    C270.694,347.002,269.694,333.402,261.294,326.102z"/><path d="M483.994,134.702l-112.4-126.9c-10-10.1-22.5-10.7-31.2,0l-114.4,126.9c-7.3,8.3-6.2,21.8,2.1,29.1    c12.8,10.2,25.7,3.2,29.1-2.1l77-86.8v345.9c0,11.4,9.4,20.8,20.8,20.8s20.8-8.3,20.8-19.8v-346.8l77,86.8    c8.3,8.3,20.8,9.4,29.1,2.1C490.194,155.502,491.294,143.002,483.994,134.702z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>'

                var shopresultclone = document.querySelector('#shop_card_result').cloneNode(true) //Clone the shop card node to use as template for our results
                var sponsor = shopresultclone.querySelector('.shop_card_sponsored')
                if (sponsor) sponsor?.remove() //Remove sponsor text if it exists
                var clonetitle = styletitle(shopresultclone.querySelector('div div div:nth-child(2) > div:nth-child(1) > div'))
                var el5 = shopresultclone.querySelectorAll('svg')[1]
                if (!svgindex) {        //Look for right index of the svg element
                    shopresultclone.querySelectorAll('svg').forEach(function (svg, idx) {
                        if (svg.parentElement.querySelector('span')) svgindex = idx

                    })
                }


                var cloneprice = shopresultclone.querySelectorAll('svg')[svgindex].parentElement.querySelector('span')
                var br = document.createElement("br");
                var restname = document.createElement('span')
                var details = document.createElement('span')
                br.id = 'brel'
                restname.id = 'restnameel'
                details.id = 'detailsel'

                //Elements of the shop card to delete later 
                var el2 = shopresultclone.querySelector('div div div:nth-child(2) > div:nth-child(2)')
                var el3 = shopresultclone.querySelector('div div div:nth-child(1)')
                var el4 = clonetitle.parentElement.parentElement.parentElement.previousElementSibling
                var clonedescription = shopresultclone.querySelector('div div div:nth-child(2) > div:nth-child(3)')
                var btncontainer = stylebtncont(document.createElement('div'))

                clonetitle.parentElement.parentElement.appendChild(btncontainer)
                clonetitle.parentElement.parentElement.prepend(details)
                clonetitle.parentElement.parentElement.prepend(br)
                clonetitle.parentElement.parentElement.prepend(restname)

                //Remove ui elements of existing shop card to fit our needs
                el2?.remove()
                el3?.remove()
                el4?.remove()
                el5?.remove()
                resultcontainer.addEventListener('scroll', function (event) {
                    var element = event.target;
                    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                        showFood()
                    }
                });
                //Creating sorter button
                sortbtn = new button(svgsort, countertext.parentElement)
                sortbtn.addEventListener('click', sorter)
                productlist = []
                var svgindex
                searchinput.addEventListener("keyup", (event) => {
                    if (event.key === "Enter") {
                        productlist = []
                        loading(resultcontainer)
                        setTimeout(getFood(searchinput.value), 0);
                        setTimeout(() => { asc(); }, 0);
                        stoploading(resultcontainer)

                    }
                })
                shopresultclone.querySelectorAll('svg')[0].remove()
                cloneprice.parentElement.style.backgroundColor = green[1]

                //Function to create buttons with a specified svg
                function button(svg, container) {
                    div = document.createElement('div')
                    div.style.backgroundColor = redbtncolor
                    div.style.borderRadius = '20px'
                    div.style.height = '4vh'
                    div.style.width = '4vh'
                    div.style.alignItems = 'center'
                    div.style.justifyContent = 'center'
                    div.style.display = 'flex'
                    div.style.marginRight = '5px'
                    div.style.cursor = 'pointer'
                    div.innerHTML = svg
                    container.appendChild(div)
                    return div
                }

                //Function to style the cloned title element
                function styletitle(title) {
                    title.parentElement.parentElement.parentElement.style.padding = '12px 12px 5% 12px'
                    title.style.whiteSpace = 'normal'
                    title.style.marginTop = '10px'
                    title.style.height = '100%'
                    title.parentElement.style.height = '100%'
                    title.parentElement.parentElement.style.height = '100%'
                    title.parentElement.parentElement.style.maxWidth = '100%'
                    title.style.overflow = 'visible'
                    return title
                }

                //Function to style the button container element
                function stylebtncont(btncont) {
                    btncont.style.height = '4vh'
                    btncont.style.width = '100%'
                    btncont.style.alignItems = 'center'
                    btncont.style.display = 'flex'
                    btncont.style.marginTop = '5px'
                    return btncont
                }


                //Function to append loadingdiv image to a container
                function loading(container) {
                    container.innerHTML = ''
                    loadingdiv = document.createElement('div')
                    loadingdiv.id = 'loadingdiv'
                    loadingdiv.style.alignItems = 'center'
                    loadingdiv.style.justifyContent = 'center'
                    loadingdiv.style.display = 'flex'
                    loadingdiv.style.margin = '40px 50px'
                    loadingdiv.style.padding = '30px'
                    loadingdiv.innerHTML = `<picture><img src="https://live.pystatic.com/webassets/AppscoreWeb/monolith/4.0.19/images/monolith-shopListLoader.cca36f65.png" class="sc-11h6bs4-0 byKNUF sc-16krbne-0 sc-ums96j-1 dPVrMx lazyloaded" alt="Cargando..." data-src="https://live.pystatic.com/webassets/AppscoreWeb/monolith/4.0.19/images/monolith-shopListLoader.cca36f65.png" data-srcset="https://live.pystatic.com/webassets/AppscoreWeb/monolith/4.0.19/images/monolith-shopListLoader.cca36f65.png" srcset="https://live.pystatic.com/webassets/AppscoreWeb/monolith/4.0.19/images/monolith-shopListLoader.cca36f65.png"></picture>`
                    container.appendChild(loadingdiv)
                }

                //Function to remove the loadingdiv image from a container
                function stoploading(container) {
                    container.querySelector('#loadingdiv')?.remove()
                }

                //Function to reverse the sorted results
                function sorter() {
                    productlist.reverse()
                    elnumber = 0
                    loading(resultcontainer)
                    setTimeout(showFood(), 0)
                    stoploading(resultcontainer)
                }
                //Function to sort the results
                function asc() {
                    productlist = productlist.sort(function (a, b) {
                        return a.price - b.price;
                    })
                    resultcontainer.innerHTML = '' //Limpiar resultados
                    setTimeout(showFood(), 0)

                }



                //Wrapper Function
                function wrap(el, link) {
                    wrapper = document.createElement('a');
                    wrapper.href = link;
                    el.parentNode.insertBefore(wrapper, el);
                    wrapper.appendChild(el);
                }

                //Capitalize function
                function capitalize(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }

                //Get menus from all the restaurants
                async function getMenus() {
                    promisearr = []
                    for (const [idx, element] of restaurantsjson.list.data.entries()) {
                        menus = {}
                        element.menu = {}
                        promisearr.push(fetch(`https://www.pedidosya.com.uy/v2/niles/partners/${element.id}/menus?isJoker=false&occasion=DELIVERY`).then(res => res.json()).then(menu => {
                            element.menu[element.link] = menu
                        }))
                        if (idx % 50 == 0 && idx != 0 && restaurantsjson.list.data.length > 100) { //Wait 2 seconds every 50 restaurants to avoid pedidosya timeout
                            loadingcounter.innerText = `${idx}/${restaurantsjson.list.data.length} Restaurantes cargados`
                            await Promise.all(promisearr)
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                    await Promise.all(promisearr)
                }

                //Get products from the menus
                async function getFood(input) {
                    if (input != '' && input != undefined) {
                        inputarr = input.split(' ')
                        restaurantsjson.list.data.forEach(restaurant => {
                            Object.values(restaurant.menu)[0].sections.forEach(section => {
                                section.products.forEach(product => {
                                    productob = {} //Create object of product
                                    if (inputarr.every(searchq => product.name.toLowerCase().includes(searchq.toLowerCase()))) {
                                        productob['hours'] = new Date(restaurant.nextHour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(restaurant.nextHourClose).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        productob['opened'] = restaurant.opened
                                        productob['delivers'] = restaurant.withLogistics
                                        productob['restname'] = restaurant.name
                                        productob['restimg'] = `https://images.deliveryhero.io/image/pedidosya/restaurants/${restaurant.logo}`
                                        productob['restglink'] = `http://www.google.com/maps/place/${restaurant.latitude},${restaurant.longitude}`
                                        productob['menulink'] = `https://www.pedidosya.com.uy/restaurantes/${city}/${restaurant.link}-menu`
                                        productob['productlink'] = `${productob.menulink}?p=${product.legacyId}&menuSection=menu`
                                        productob['name'] = product.name
                                        productob['currency'] = product.price.currencyMask
                                        productob['price'] = product.price.finalPrice
                                        productob['description'] = product.description
                                        productlist.push(productob) //Add product bject to the product list
                                    }
                                });
                            });
                        });
                    }
                }


                //Function to show all the food
                async function showFood() {
                    var fragment = '';
                    countertext.innerText = productlist.length + ' comidas encontradas' //Show the number of results
                    for (const [idx, product] of productlist.slice(elnumber, elnumber + elperscroll).entries()) {
                        btncontainer.innerHTML = '' //Clear the button container
                        //Change text of to the elements
                        cloneprice.parentElement.parentElement.style.paddingTop = '2.5%'
                        clonetitle.innerText = capitalize(product.name)
                        cloneprice.style.color = green[0]
                        cloneprice.innerText = product.currency + product.price
                        clonedescription.innerHTML = `<span>${product.description}</span>`
                        restname.innerText = product.restname
                        details.innerHTML = `<span>${product.currency} ${product.price}</span>`
                        detailsstr = ' '
                        if (product.opened != 1 && product.delivers == true) {
                            detailsstr += '(Cerrado) '
                        }
                        if (product.delivers != true) {
                            detailsstr += '(Sin Delivery) '
                        }
                        detailsstr += '(' + product.hours + ')'
                        details.innerText = detailsstr

                        //Create buttons for each iteration
                        menubtn = new button(svgrest, btncontainer)
                        wrap(menubtn, productlist[idx].menulink)
                        restbtn = new button(svgmap, btncontainer)
                        wrap(restbtn, productlist[idx].restglink);
                        prodbtn = new button(svgpedido, btncontainer)
                        wrap(prodbtn, productlist[idx].productlink);

                        //Add html to the fragment
                        fragment += shopresultclone.outerHTML
                    }
                    //Add the fragment to the container
                    resultcontainer.innerHTML += fragment

                    //Increase the number of elements showed by the elements added
                    elnumber += elperscroll
                }
            }
            return;
        }
        else {
            setTimeout(function () {
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}
