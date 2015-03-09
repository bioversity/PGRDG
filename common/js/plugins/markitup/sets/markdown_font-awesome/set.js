// -------------------------------------------------------------------
// markItUp!
// -------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// -------------------------------------------------------------------
// MarkDown tags example
// http://en.wikipedia.org/wiki/Markdown
// http://daringfireball.net/projects/markdown/
// -------------------------------------------------------------------
// Feel free to add more tags
// -------------------------------------------------------------------
mySettings = {
	previewParserPath:	'',
	onShiftEnter:		{keepDefault:false, openWith:'\n\n'},
	markupSet: [
		{name:'Bold', content: '<span class="fa fa-bold"></span>', key:'B', openWith:'**', closeWith:'**'},
		{name:'Italic', content: '<span class="fa fa-italic"></span>', key:'I', openWith:'_', closeWith:'_'},
		{separator:'---------------'},
		{name:'Link', content: '<span class="fa fa-link"></span>', key:'L', openWith:'[', closeWith:']([![Url:!:http://]!] "[![Title]!]")', placeHolder:'Your text to link here...' },
		{name:'Quotes', content: '<span class="fa fa-indent"></span>', openWith:'> '},
		{name:'Code Block / Code', content: '<span class="fa fa-code"></span>', openWith:'(!(\t|!|`)!)', closeWith:'(!(`)!)'},
		{name:'Picture', content: '<span class="fa fa-picture-o"></span>', key:'P', replaceWith:'![[![Alternative text]!]]([![Url:!:http://]!] "[![Title]!]")'},
		{separator:'---------------'},
		{name:'Numeric List', content: '<span class="fa fa-list-ol"></span>', openWith:function(markItUp) {
			return markItUp.line + '. ';
		}},
		{name:'Bulleted List', content: '<span class="fa fa-list-ul"></span>', openWith:'* ' },
		{name:'Heading', content: '<span class="fa fa-header"></span>', key:'3', openWith:'### ', placeHolder:'Your title here...' },
		{name:'Horizontal rule', content: '<span class="fa fa-ellipsis-h"></span>', openWith:'\n\n----------\n\n' },
		{separator:'---------------'},
		{name:'Preview', call:'preview', content: '<span class="fa fa-check"></span>', className:"preview"}
	]
}

// mIu nameSpace to avoid conflict.
miu = {
	markdownTitle: function(markItUp, char) {
		heading = '';
		n = $.trim(markItUp.selection||markItUp.placeHolder).length;
		for(i = 0; i < n; i++) {
			heading += char;
		}
		return '\n'+heading;
	}
}
