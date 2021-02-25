$(function () {

    const form = layui.form;
    initCateInfo();
    function initCateInfo() {
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            //弹出层类别
            type: 1,
            //弹出层宽高
            area: ['500px', '300px'],
            //弹出层标题
            title: '添加类别',
            //弹出层内容
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initCateInfo()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为 form-edit 表单绑定 click 事件
    //编辑按钮
    let editIndex = null;
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault()
        editIndex = layer.open({
            //弹出层类别
            type: 1,
            //弹出层宽高
            area: ['500px', '300px'],
            //弹出层标题
            title: '编辑类别',
            //弹出层内容
            content: $('#dialog-edit').html()
        });

        const id = $(this).data('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //确认修改：
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(editIndex)
                initCateInfo()
            }
        })
    })


    //删除按钮
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initCateInfo()
                }
            })
        })
    })
})