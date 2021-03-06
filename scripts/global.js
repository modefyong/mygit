//文档加载完成后再运行函数
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}
//在节点后插入
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
//添加类
function addClass(element, value) {
    if (!element.className) {
        element.className = value;
    } else {
        var newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

//页面突出显示标记
function highlightPage() {
    //检查DOM方法是否存在
    if (!document.getElementById) return false;
    if (!document.getElementsByTagName) return false;
    var headers = document.getElementsByTagName("header");
    //检查元素是否存在
    if (headers.length == 0) return false;
    var navs = headers[0].getElementsByTagName("nav");
    //检查元素是否存在
    if (navs.length == 0) return false;
    var links = navs[0].getElementsByTagName("a");
    var linkurl;
    for (var i = 0; i < links.length; i++) {
        linkurl = links[i].getAttribute("href");//链接URL
        //在当前页面URL中是否包含链接URL
        if (window.location.href.indexOf(linkurl) != -1) {
            links[i].className = "here";
            var linktext = links[i].lastChild.nodeValue.toLowerCase();
            // console.log(links[i].lastChild.nodeValue);
            document.body.setAttribute("id", linktext);
        }
    }
}
addLoadEvent(highlightPage);

function moveElement(elementID, final_x, final_y, interval) {
    if (!document.getElementById) return false;//检查浏览器是否兼容该方法
    if (!document.getElementById(elementID)) return false;
    var elem = document.getElementById(elementID);
    if (elem.movement) {
        clearTimeout(elem.movement);
    }
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    if (!elem.style.top) {
        elem.style.top = "0px";
    }
    //获得元素当前位置
    var xpos = parseInt(elem.style.left);//检查left是否存在
    var ypos = parseInt(elem.style.top);
    var dist = 0;
    if (xpos == final_x && ypos == final_y) {
        return true;
    }
    if (xpos < final_x) {
        //缓冲运动
        dist = Math.ceil((final_x - xpos) / 10);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        dist = Math.ceil((xpos - final_x) / 10);
        xpos = xpos - dist;
    }
    if (ypos < final_y) {
        dist = Math.ceil((final_y - ypos) / 10);
        ypos = ypos + dist;
    }
    if (ypos > final_y) {
        dist = Math.ceil((ypos - final_y) / 10);
        ypos = ypos - dist;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    var repeat = "moveElement('" + elementID + "' , " + final_x + " , " + final_y + " , " + interval + ")";
    elem.movement = setTimeout(repeat, interval);
}

function prepareSlideshow() {
    //动态创建div盒子里的img图片
    if (!document.getElementById) return false;//检查浏览器是否兼容该方法
    if (!document.getElementById("intro")) return false;
    if (!document.getElementsByTagName) return false;
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id", "slideshow")
    var preview = document.createElement("img");
    preview.setAttribute("id", "preview");
    preview.setAttribute("src", "images/slideshow.gif");
    preview.setAttribute("alt", "Jay Skript slideshow");
    slideshow.appendChild(preview);
    var intro = document.getElementById("intro");
    insertAfter(slideshow, intro);
    //加个小窗口
    var frame = document.createElement("img");
    frame.setAttribute("id", "frame");
    frame.setAttribute("src", "images/frame.gif");
    frame.setAttribute("alt", "");
    slideshow.appendChild(frame);

    var links = document.getElementsByTagName("a");
    var destination;
    for (var i = 0; i < links.length; i++) {
        links[i].onmouseover = function () {
            destination = this.getAttribute("href");
            if (destination.indexOf("index.html") != -1) {
                moveElement("preview", 0, 0, 5);
            }
            if (destination.indexOf("about.html") != -1) {
                moveElement("preview", -150, 0, 5);
            }
            if (destination.indexOf("photos.html") != -1) {
                moveElement("preview", -300, 0, 5);
            }
            if (destination.indexOf("live.html") != -1) {
                moveElement("preview", -450, 0, 5);
            }
            if (destination.indexOf("contact.html") != -1) {
                moveElement("preview", -600, 0, 5);
            }
        }
    }
}
addLoadEvent(prepareSlideshow);

function showSection(id) {
    //选择性的每次只选择一个section
    var sections = document.getElementsByTagName("section");
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].getAttribute("id") != id) {
            sections[i].style.display = "none";
        } else {
            sections[i].style.display = "block";
        }
    }
}
function prepareInternalnav() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    var articles = document.getElementsByTagName("article");
    if (articles.length == 0) return false;
    var navs = articles[0].getElementsByTagName("nav");
    if (navs.length == 0) return false;
    var nav = navs[0];
    var links = nav.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        //将内部链接（以#为分隔符）作为字符串提取出来。
        var sectionId = links[i].getAttribute("href").split("#")[1];
        //检查是否存在带有相应ID的元素。
        if (!document.getElementById(sectionId)) continue;
        //在页面加载后，需要默认隐藏所有部分。
        document.getElementById(sectionId).style.display = "none";
        //为每个链接创建自定义属性，以解决作用域问题。
        links[i].destination = sectionId;
        links[i].onclick = function () {
            console.log(this);
            showSection(this.destination);
            return false;
        }
    }
}
addLoadEvent(prepareInternalnav);

// photos javascript图片库
function preparePlaceholder() {
    //必须！在其他页面不支持时，平稳退化！
    if (!document.createElement) return false;
    if (!document.createTextNode) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegallery")) return false;
    //动态创建DOM元素，减少html内容标记，优化dom树解析
    var oDiv = document.createElement("div");
    oDiv.setAttribute("class", "swap");
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id", "placeholder");
    placeholder.setAttribute("src", "images/placeholder.gif");
    placeholder.setAttribute("alt", "my image gallery");
    placeholder.setAttribute("title", "my image gallery");
    var description = document.createElement("p");
    description.setAttribute("id", "description");
    var destext = document.createTextNode("图片说明");
    description.appendChild(destext);
    var gallery = document.getElementById("imagegallery");
    insertAfter(oDiv, gallery);
    oDiv.appendChild(placeholder);
    insertAfter(description, placeholder);
}

//将图片路径传给所谓的”占位符“路径。
function showPic(whichpic) {
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    placeholder.setAttribute("src", source);
    if (whichpic.getAttribute("title")) {
        var text = whichpic.getAttribute("title");
    } else {
        var text = "";
    }

    var description = document.getElementById("description");
    if (description.firstChild.nodeType == 3) {
        description.firstChild.nodeValue = text;
    }
    return false;
}

function prepareGallery() {
    if (!document.getElementById("imagegallery")) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        //点击事件，执行语句放到函数体内。
        links[i].onclick = function () {
            // showPic(this);return false;//合并简写
            return showPic(this);//为了使图片切换失败时能打开链接，使HTML页面width="40px" height="40"平稳退化
            // popUp(this.getAttribute("href"));   
        }
        // links[i].onkeypress = links[i].onclick;
    }
}
addLoadEvent(prepareGallery);
addLoadEvent(preparePlaceholder);

//table
function stripeTables() {
    if (!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        var odd = false;
        var rows = tables[i].getElementsByTagName("tr");
        for (var j = 0; j < rows.length; j++) {
            if (odd == true) {
                addClass(rows[j], "odd");
                odd = false;
            } else {
                odd = true;
            }
        }
    }
}

function highlightRows() {
    if (!document.getElementsByTagName) return false;
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].oldClassName = rows[i].className
        rows[i].onmouseover = function () {
            addClass(this, "highlight");
        }
        rows[i].onmouseout = function () {
            this.className = this.oldClassName
        }
    }
}

function displayAbbreviations() {
    if (!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
    var abbreviations = document.getElementsByTagName("abbr");
    if (abbreviations.length < 1) return false;
    var defs = new Array();
    for (var i = 0; i < abbreviations.length; i++) {
        var current_abbr = abbreviations[i];
        if (current_abbr.childNodes.length < 1) continue;
        var definition = current_abbr.getAttribute("title");
        var key = current_abbr.lastChild.nodeValue;
        defs[key] = definition;
    }
    var dlist = document.createElement("dl");
    for (key in defs) {
        var definition = defs[key];
        var dtitle = document.createElement("dt");
        var dtitle_text = document.createTextNode(key);
        dtitle.appendChild(dtitle_text);
        var ddesc = document.createElement("dd");
        var ddesc_text = document.createTextNode(definition);
        ddesc.appendChild(ddesc_text);
        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }
    if (dlist.childNodes.length < 1) return false;
    var header = document.createElement("h3");
    var header_text = document.createTextNode("Abbreviations");
    header.appendChild(header_text);
    var articles = document.getElementsByTagName("article");
    if (articles.length == 0) return false;
    var container = articles[0];
    container.appendChild(header);
    container.appendChild(dlist);
}

addLoadEvent(stripeTables);
addLoadEvent(highlightRows);
addLoadEvent(displayAbbreviations);

// label中的文本被点击，关联的表单字段就会获得焦点
//模仿label默认行为
function focusLabels() {
    if (document.getElementsByTagName) return false;
    var labels = document.getElementsByTagName("label");
    for (var i = 0; i < labels.length; i++) {
        if (!label[i].getAttribute("for")) continue;
        labels[i].onclick = function () {
            var id = this.getAttribute("for");
            if (!document.getElementById) return false;
            var element = document.getElementById(id);
            element.focus();
        };
    }
}
// addLoadEvent(focusLabels);
//操作placeholder属性
//模仿placeholder默认行为
function resetFields(whichform) {
    // if (Modernizr.input.placeholder) return;
    for (var i = 0; i < whichform.elements.length; i++) {
        var element = whichform.elements[i];
        if (element.type == "submit") continue;
        var check = element.placeholder || element.getAttribute("placeholder");
        if (!check) continue;
        element.onfocus = function () {
            var text = this.placeholder || this.getAttribute("placeholder");
            if (this.value == text) {
                this.className = "";
                this.value = "";
            }
        }
        element.onblur = function () {
            if (this.value == "") {
                this.className = "placeholder";
                this.value = this.placeholder || this.getAttribute("placeholder");
            }
        }
        element.onblur();
    }
}
// 循环遍历文档中的所有form对象，并将每个form对象传给resetFields函数
function prepareForms() {
    for (var i = 0; i < document.forms.length; i++) {
        var thisform = document.forms[i];
        resetFields(thisform);
        thisform.onsubmit = function () {
            // console.log(1) 闪了一下，提交失败？
            if (!validateForm(this)) return false;// 1. 无法弹出警告框？原因？
            var article = document.getElementsByTagName("article")[0];
            if (submitFormWithAjax(this, article)) return false;
            // console.log(1) 没显示？
            return true;
        };
    }
}


// addLoadEvent(prepareForms);
// 验证表单
function isFilled(field) {
    if (field.value.replace(' ', '').length == 0) return false;
    // if(!field.value == " ") return false;
    var placeholder = field.placeholder || field.getAttribute('placeholder');
    return (field.value != placeholder);
}
// 检查电子邮件，有问题！？
function isEmail(field) {
    return (field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1);
}
function validateForm(whichform) {
    // alert(1)
    for (var i = 0; i < whichform.elements.length; i++) {
        var element = whichform.elements[i];
        if (element.required == 'required') {
            if (!isFilled(element)) {
                alert("Please fill in the " + element.name + " field.");
                return false;
            }
        }
        if (element.type == 'email') {
            if (!isEmail(element)) {
                alert("The " + element.name + " field must be a valid email address.");
                return false;
            }
        }
    }
    return true;
}


//创建Ajax对象,会出现跨域问题，解决复杂！
function getHTTPObject() {//这个函数出现问题！
    if (typeof XMLHttpRequest == "undefined") {
        XMLHttpRequest = function () {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) { }
            return false;
        }
    }
    return new XMLHttpRequest();
}
//创建加载图像。
//接收一个DOM元素作为参数，删除其子元素，然后将图像添加到该元素。
function displayAjaxLoading(element) {
    //如果目标节点有子元素就从最后一个节点删除，直至所有子元素为空。
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
    var content = document.createElement("img");
    content.setAttribute("src", "images/loading.gif");
    content.setAttribute("alt", "Loading");
    element.appendChild(content);
}
//拦截表单
function submitFormWithAjax(whichform, thetarget) {
    var request = getHTTPObject();
    if (!request) { return false; }
    displayAjaxLoading(thetarget);
    // console.log(1),没显示
    //创建URL编码的表单数据字符串
    var dataParts = [];
    var element;
    for (var i = 0; i < whichform.elements.length; i++) {
        element = whichform.elements[i];
        dataParts[i] = element.name + "=" + encodeURIComponent(element.value);
    }
    var data = dataParts.join("&");
    request.open('POST', whichform.getAttribute("action"), true);
    //头部信息对于POST请求是必须的，它表示请求中包含URL编码的表单
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // response.setHeader("Access-Control-Allow-Origin","*"); 
    //创建处理响应的onreadystatechange事件处理程序
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {//填错！！！
                var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
                if (matches.length > 0) {
                    //mathes[1]是responseText中与捕获组（一对圆括号）中的模式匹配的部分。  
                    thetarget.innerHTML = matches[1];
                } else {
                    thetarget.innerHTML = "<p>0ops, there was an error. Sorry.</p>";
                }
            } else {
                thetarget.innerHTML = "<p>" + request.statusText + "</p>";
            }
        }
    };
    //发送请求
    request.send(data);
    return true;
}

if (window.location.href.indexOf("contact.html") != -1) {
    addLoadEvent(focusLabels);
    addLoadEvent(prepareForms);
}
