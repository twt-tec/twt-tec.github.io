// script.js

var res = {
    message: '这是提示信息',
    level: {
        objects: [
        ],
        pass_condition: [
        ]
    }
}
var leftop = {
    X: 1000,
    Y: 100,
}

var border = document.getElementById('border');
border.style.position = 'absolute';
border.style.width = 450 + 'px',
border.style.height = 600 + 'px';
border.style.left = leftop.X + 'px';
border.style.top = leftop.Y + 'px';
border.style.border = "2px solid #000";
border.style.zIndex = -1;

var cursor = document.getElementById('cursor');
cursor.style.position = 'absolute';
cursor.style.width = '10px';
cursor.style.height = '10px';
cursor.style.left = leftop.X + 'px';
cursor.style.top = leftop.Y + 'px';
cursor.style.border = "2px solid #555";
cursor.style.zIndex = 999;
cursor.style.userSelect = 'none';
cursor.setAttribute('draggable', false);
cursor.style.maxWidth = '100%';
cursor.style.maxHeight = '100%';
cursor.X = leftop.X;
cursor.Y = leftop.Y;
cursor.addEventListener('mousedown', dragStart);



document.getElementById('withdraw').addEventListener('click', function () {
    var a = document.getElementsByClassName('pics');
    a[a.length - 1].remove();
    res.level.objects.pop();
});

document.getElementById('setup').addEventListener('click', function () {
    var pics = document.getElementsByClassName('pics');
    for (var i = 0; i < pics.length; i++) {
        res.level.objects[i].position = {
            col: parseFloat(pics[i].X) - leftop.X,
            row: parseFloat(pics[i].Y) - leftop.Y,
        };
    }
});

document.getElementById('accept_group').addEventListener('click', function () {
    var hint = document.createElement('div');
    hint.innerText = '条件组 ' + res.level.pass_condition.length;
    hint.className = 'groups';
    var cur = document.getElementById('group');
    cur.append(hint);
    res.level.pass_condition.push([]);
});

document.getElementById('removeShower').addEventListener('click', function() {
    document.getElementById('shower').style.display = 'none';
});

document.getElementById('accept_rule').addEventListener('click', function () {
    var hint = document.createElement('div');
    hint.className = 'rules';
    var id = res.level.pass_condition[res.level.pass_condition.length - 1].length;
    hint.innerText = '条件 ' + id;
    var i = document.getElementById('first_object').value;
    var j = document.getElementById('second_object').value;
    var show = document.createElement('button');
    show.innerText = '显示相对位置区域';
    hint.innerText += ' (' + i + ' <- ' + j + ')';
    var cur = document.getElementsByClassName('groups');
    var lid = cur.length - 1;
    var cur = cur[cur.length - 1];
    show.onclick = () => {
        var c = document.getElementById("shower");
        c.style.display = 'inline';
        c.style.position = 'absolute';
        c.style.border = '1px solid #ac6666';
        var objs = document.getElementsByClassName('pics');
        console.log(lid);
        console.log(id);
        console.log(res.level.pass_condition[lid])
        var row_diff = res.level.pass_condition[lid][id].row_diff;
        var col_diff = res.level.pass_condition[lid][id].col_diff;
        c.style.left = objs[i].X + col_diff.min + 'px';
        c.style.top = objs[i].Y + row_diff.min + 'px';
        c.style.width = col_diff.max - col_diff.min + 'px';
        c.style.height = row_diff.max - row_diff.min + 'px';
    }; 
    hint.append(show);
    cur.append(hint);
    res.level.pass_condition[res.level.pass_condition.length - 1].push({
        first_object_id: i,
        second_object_id: j,
        row_diff: {
            min: 0,
            max: 0,
        },
        col_diff: {
            min: 0,
            max: 0,
        },
    });
});

document.getElementById('withdraw_group').addEventListener('click', function () {
    var last = document.getElementsByClassName('groups');
    var last = last[last.length - 1];
    last.remove();
    res.level.pass_condition.pop();
});

document.getElementById('withdraw_rule').addEventListener('click', function () {
    var last = document.getElementsByClassName('rules');
    var last = last[last.length - 1];
    last.remove();
    res.level.pass_condition[res.level.pass_condition.length - 1].pop();
});


document.getElementById('set_topleft').addEventListener('click', function () {
    var cur = res.level.pass_condition[res.level.pass_condition.length - 1];
    var i = cur[cur.length - 1].first_object_id;
    var j = cur[cur.length - 1].second_object_id;
    var ix = document.getElementsByClassName('pics')[i].X;
    var iy = document.getElementsByClassName('pics')[i].Y;
    if (j != -1) {
        var jx = document.getElementsByClassName('pics')[j].X;
        var jy = document.getElementsByClassName('pics')[j].Y;
    }
    else {
        var jx = document.getElementById('cursor').X;
        var jy = document.getElementById('cursor').Y;
    }
    var len = res.level.pass_condition[res.level.pass_condition.length - 1].length;
    cur[cur.length - 1].col_diff.min = jx - ix;
    cur[cur.length - 1].row_diff.min = jy - iy;
});

document.getElementById('set_rightdown').addEventListener('click', function () {
    var cur = res.level.pass_condition[res.level.pass_condition.length - 1];
    var i = cur[cur.length - 1].first_object_id;
    var j = cur[cur.length - 1].second_object_id;
    var ix = document.getElementsByClassName('pics')[i].X;
    var iy = document.getElementsByClassName('pics')[i].Y;
    if (j != -1) {
        var jx = document.getElementsByClassName('pics')[j].X;
        var jy = document.getElementsByClassName('pics')[j].Y;
    }
    else {
        var jx = document.getElementById('cursor').X;
        var jy = document.getElementById('cursor').Y;
    }
    var len = res.level.pass_condition[res.level.pass_condition.length - 1].length;
    cur[cur.length - 1].col_diff.max = jx - ix;
    cur[cur.length - 1].row_diff.max = jy - iy;
});

document.getElementById('imageInput').addEventListener('change', function (event) {
    var files = event.target.files;
    var file = files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var img = document.createElement('img');
        img.src = e.target.result;
        var pic = new Image();
        pic.src = e.target.result;  
        img.classList.add('draggable');
        img.style.position = 'absolute';
        img.style.userSelect = 'none';
        img.setAttribute('draggable', false);
        img.style.left = leftop.X + "px";
        img.style.top = leftop.Y + "px";
        img.X = leftop.X;
        img.Y = leftop.Y;
        img.className = 'pics';
        img.pid = res.level.objects.length;
        img.title = '对象编号: ' + img.pid; 

        var container = document.getElementById('imageContainer');
        container.appendChild(img);
        
        var rec = img.getBoundingClientRect();
        res.level.objects.push({
            position: {
                col: rec.left - leftop.X,
                row: rec.top - leftop.Y,
            },
            region_size: {
                width: 450,
                height: 600,
            },
            size: {
                width: 0,
                height: 0,
            },
            pic_src: img.src,
        })
        pic.onload = () => {
            img.style.width = pic.width + 'px'; 
            img.style.height = pic.height + 'px'; 
            res.level.objects[res.level.objects.length - 1].size = {
                width: pic.width,
                height: pic.height,
            }
        };


        img.addEventListener('mousedown', dragStart);
        img.addEventListener('wheel', handleWheel);
    };

    reader.readAsDataURL(file);
});

document.getElementById('gen').addEventListener('click', downloadText);


function downloadText() {
    res.message = document.getElementById('message').value;
    fileName = 'res.json'
    text = JSON.stringify(res)
    const url = window.URL || window.webkitURL || window;
    const blob = new Blob([text]);
    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = url.createObjectURL(blob);
    saveLink.download = fileName;
    saveLink.click();
}

var offsetX, offsetY;
var curDOM;

function handleWheel(e) {
    e.preventDefault();
    var img = e.target;
    var delta = e.deltaY > 0 ? 1.1 : (1/1.1);
    var nwidth = parseFloat(img.style.width) * delta;
    var nheight = parseFloat(img.style.height) * delta;
    img.style.width = nwidth + 'px';
    img.style.height = nheight + 'px';
    res.level.objects[img.pid].size = {
        width: nwidth,
        height: nheight,
    }
}

function dragStart(e) {
    e.preventDefault();
    var img = e.target;
    curDOM = img;
    offsetX = e.clientX - img.getBoundingClientRect().left;
    offsetY = e.clientY - img.getBoundingClientRect().top;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function drag(e) {
    e.preventDefault();
    var img = curDOM;
    if (img.id != 'cursor' && img.className != 'pics') return;
    var dragX = e.clientX - offsetX;
    var dragY = e.clientY - offsetY;
    img.style.left = dragX + 'px';
    img.style.top = dragY + 'px';
    img.X = dragX;
    img.Y = dragY;
}

function dragEnd() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
}
