/* 기본설정 */
Element.prototype.hasClass = function(prop){
	for(var i=0;i<this.classList.length;i++){
		if(this.classList[i] == prop){
			return true;
		}
	}
	return false;
}

/* UICompoenet */
var UIComponent = UIComponent||{};
UIComponent.Event = {
	"popupOpen":new Event("popupOpen"),
	"popupClose":new Event("popupClose"),
	"popupShow":new Event("popupShow"),
	"popupHide":new Event("popupHide"),
	"tooltipShow":new Event("tooltipShow"),
	"tooltipHide":new Event("tooltipHide"),
	"toggleClass":new Event("toggleClass"),
	"finished":new Event("finished"),
	"open":new Event("open"),
	"close":new Event("close"),
	"screenIn":new Event("screenIn"),
	"screenOut":new Event("screenOut"),
	"screenOn":new Event("screenOn"),
}
UIComponent.Common = {};

/** 천단위마다 콤마 생성 */
UIComponent.Common.addComma = function(data){
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 천단위마다 콤마 제거 */
UIComponent.Common.removeCommas = function(data){
    if(!data || data.length == 0){
    	return "";
    }else{
    	return data.split(",").join("");
    }
}

/** 최소,최대 값중 랜덤 숫자 생성 */
UIComponent.Common.randRange = function(minNum, maxNum){
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

/** 배열 무작위 설정 */
UIComponent.Common.shuffleArray = function(inputArray){
    return inputArray.sort(()=> Math.random() - 0.5);
}

/** 현재 스크롤 Top 위치의 퍼센트 */
UIComponent.Common.getScrollTopPosition = function(el) {
    return Math.floor((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
}

/** 현재 스크롤 Left 위치의 퍼센트 */
UIComponent.Common.getScrollLeftPosition = function(el) {
    return Math.floor((el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100);
}

/** log */
UIComponent.log = function(...args){
	console.log("/****************************************************/");
	console.log(args.join());
}

/*
 * prop = {target}
 */
UIComponent.Tooltip = function(prop){
    var _self     = this;
    var _target   = null; 
    var _closeBtn = null;

    function init(){
        setTarget();
        setCloseBtn();
    }

    this.accept = function (visitor) {
        visitor.visit(_self);
    };

    this.getElement = function(){
        return _target;
    }

    function setTarget(){
        _target = prop['target'];
    }

    function setCloseBtn(){
        _closeBtn = _target.getElementsByClassName('icon-close')[0];
        _closeBtn.addEventListener('click', function(){
            _self.hide();
        });
        _closeBtn.addEventListener('blur', function(){
            _self.hide();
        });
    }

    this.show = function() {
        _target.classList.add('active');
        _target.dispatchEvent(UIComponent.Event.tooltipShow);
    }

    this.hide = function() {
        _target.classList.remove('active');
        _target.dispatchEvent(UIComponent.Event.tooltipHide);
    }

    init();
}
/*
    @param {
            target,
            classes
    } prop 
 */

UIComponent.Accordion = function(prop){
    var self = this;
    var accoBtn = null;
    var accCont = null;
    var target = null;

    function init(){
        setTarget();
        setButton();
        setContainer();
    }

    function setTarget(){
        target = prop['target'];
    }

    function setButton(){
        accoBtn = target.getElementsByClassName('accordion-header')[0];
        accoBtn.addEventListener('click', function(){
            if(target.hasClass('toggle-active')){
                self.close();
            } else {
                self.open();
            }
            
        });
    }

    function setContainer(){
        accCont = target.getElementsByClassName('accordion-container')[0];
    }
    
    function setClasses(){
        
    }

    this.open = function() {
        target.classList.add('toggle-active');
    }

    this.close = function() {
        target.classList.remove('toggle-active');
    }

    init();
}
/*
prop : {}
- target : input element
- label : 라벨 element
*/

UIComponent.InputPrice = function(prop){
	var _self = this;
	var _el = null;
	var _label = null;

	function init() {		
		setEl();
		setEvent();
	}

	function setEl() {
		_el    = prop['target'];
		_label = prop['label'];
	}
	
	function setEvent() {	

		_el.addEventListener('input', function(){
			setTimeout(function(){
				onChangeHandler();
			}, 10 );
		});

		_el.addEventListener('keydown', function(){
			setTimeout(function(){
				onChangeHandler();
			}, 10 );
		});

		_el.addEventListener('change', function(e){
			onChangeHandler(e);
		});
	}

	function onChangeHandler(e){
		console.log("###### onChangeHandler",_el.value.length);
		_label.innerText = _el.value;
		if(_el.value.length>0){
			_label.classList.remove('no-data');
		}
		else{
			if(!_label.hasClass('no-data')){
				_label.classList.add('no-data');
			}
			_label.innerText = '0';
		}
	}
	init();
}
/*
prop : {}
- target : input element
- placeholder : 라벨 element
- clearButton : 삭제 버튼 element
*/

UIComponent.InputText = function(prop){
	var _self = this;
	var _el = null;
	var _setInterval = null;
	var _placeholder = null;
	var _clearButton = null;
	var _container = null;
	
	function init(){
		setPlaceholder();
		setClearButton();		
		setInput();
		setInputs();
		setInputPrice();
	}

	function setPlaceholder(){
		
		if(typeof prop["placeholder"] == 'object'){
			_placeholder = prop["placeholder"];
		}
	}

	function setClearButton(){
		if(typeof prop["clearButton"] == 'object'){
			_clearButton = prop["clearButton"];
			_clearButton.addEventListener("click",function(){
				_el.value = '';
				_el.focus();
			});
		}
	}

	function setInput(){
		_el = prop["target"];
		
		if(_el.parentNode.hasClass('inp-box')){
			_container = _el.parentNode;
			if(_el.value.length > 0){
				_container.classList.remove("default","focus");
				_container.classList.add("filled");
			}
			else{
				_container.classList.remove("filled","focus");
				_container.classList.add("default");
			}
		}

		_el.addEventListener("focus",function (e){
			onFocusHandler(e);
		});

		_el.addEventListener("blur",function (e){
			onBlurHandler(e);
		});

		_el.addEventListener("change",function (e){
			onChangeHandler(e);
		});
		
	}

	function setInputs(){
		if(_el.parentNode.hasClass('inp-box')){
			var _inputs = _container.getElementsByTagName('input');
			if(_inputs.length < 2) return null;

			for( var i=0;i<_inputs.length;i++){
				var __input = _inputs[i];

				__input.addEventListener("focus",function (e){
					onFocusHandler(e);
				});
		
				__input.addEventListener("blur",function (e){
					onBlurHandler(e);
				});
		
				__input.addEventListener("change",function (e){
					onChangeHandler(e);
				});
			}
		}
	}

	function setInputPrice(){
		var __input = _el;
		var __label = document.querySelector('.type-price label span');

		if(_container.hasClass('type-price')){
			new UIComponent.InputPrice(
				{
					'target':__input,
					'label':__label,
				}
			);
		}
	}

	function onFocusHandler(e){
		var val=null;
		var _target=e.target;
		_setInterval = setInterval(function(){
			if( val != _target.value){
				val = _target.value;
				_target.dispatchEvent(new Event("change"));
			}
		},100);

		_container.classList.remove("filled","default");
		_container.classList.add("focus");
		_target.classList.add("active");
	}

	function onBlurHandler(e){
		var _target=e.target;
		clearInterval(_setInterval);
		_setInterval=null;

		if(_container){
			if(_el.value.length > 0){
				_container.classList.remove("focus","default");
				_container.classList.add("filled");
			}
			else{
				_container.classList.remove("focus","filled");
				_container.classList.add("default");
			}

			if(_target.value.length > 0){
				_target.classList.add("active");
			}
			else{
				_target.classList.remove("active");
			}
		}
	}

	function onChangeHandler(e){
		//console.log("change");
	}
	init();
}
/*
prop : {}
- target : 모달팝업 element
- classes : 클래스 
- callBackOpenAfter : 팝업 실행 후 콜백함수
- callBackOpenBefore : 팝업 실행 전 콜백함수
- callBackCloseAfter : 팝업 닫기 후 콜백함수
- callBackCloseBefore : 팝업 닫기 전 콜백함수
*/
UIComponent.Modal = function(prop){
	var _self = this;
	var _el;
	var _classes = null;
	var _callBackOpenAfter = null;
	var _callBackOpenBefore = null;

	var _callBackCloseAfter = null;
	var _callBackCloseBefore = null;

	if(prop == undefined || prop == null || typeof prop != "object")return null;

	this.open = function(){
		if(_callBackOpenBefore!=null) _callBackOpenBefore();
		_el.style.display="block";
		setTimeout(function(){
			_el.classList.add("show");
		},50);
		if(_callBackOpenAfter!=null) _callBackOpenAfter();
		
		_el.dispatchEvent(UIComponent.Event.popupOpen,{"item":this});
	}

	this.close = function(){
		if(_callBackCloseBefore!=null) _callBackCloseBefore();
		_el.style.display="none";
		_el.classList.remove("show");
		if(_callBackCloseAfter!=null) _callBackCloseAfter();

		_el.dispatchEvent(UIComponent.Event.popupClose,{"item":this});
	}

	this.getTarget = function(){
		return _el;
	}

	function init(prop){
		_el = prop['target'];
		_classes = prop['classes'];
		_self.name = prop['name'];
		if(_classes != undefined){
			setClasses(_classes);
		}
		setButtons();
	}

	function setClasses(param){
		if( Array.isArray(param) ){
			for( var i=0;i<param.length;i++){
				_el.className += param[i];
			}
		}
		else{
			_el.className += param;
		}
	}

	function setButtons(){
		var closeBtn = _el.getElementsByClassName("btn-popup-close")[0];
		var confirmBtn = _el.getElementsByClassName("btn-popup-confirm")[0];
		var cencelBtn = _el.getElementsByClassName("btn-popup-cencel")[0];
		
		if(closeBtn){
			closeBtn.addEventListener("click",function(e){
				_self.close();
			},false);
		}

		if(confirmBtn){
			confirmBtn.addEventListener("click",function(e){
				_self.close();
			},false);
		}

		if(cencelBtn){
			cencelBtn.addEventListener("click",function(e){
				_self.close();
			},false);
		}
	}

	init(prop);
};
UIComponent.SelectBox = function(prop){
	var _self = this;
	var _el = null;
	var _placeholder = null;
	var _container = null;
	
	function init(){
		setPlaceholder();
		setSelectBox();
	}

	function setPlaceholder(){
		if(typeof prop["placeholder"] == 'object'){
			_placeholder = prop["placeholder"];
		}
	}

	function setSelectBox(){
		_el = prop["target"];
		
		if(_el.parentNode.hasClass('select-box')){
			_container = _el.parentNode;
			if(_el.selectedIndex > 0){
				_container.classList.remove("default");
				_container.classList.add("filled");
			}
			else{
				_container.classList.remove("filled");
				_container.classList.add("default");
			}
		}

		_el.addEventListener("focus",function (e){
			onFocusHandler(e);
		});

		_el.addEventListener("blur",function (e){
			onBlurHandler(e);
		});

		_el.addEventListener("change",function (e){
			onChangeHandler(e);
		});
	}

	function onFocusHandler(e){
		_container.classList.add("focus");
	}

	function onBlurHandler(e){
		if(_container){
			_container.classList.remove("focus");
		}
	}

	function onChangeHandler(e){
		if(_container){
			var _index = _el.selectedIndex;
			if(_index == 0){
				_container.classList.remove("filled");
				_container.classList.add("default");
			}
			else{
				_container.classList.remove("default");
				_container.classList.add("filled");
			}
			_el.blur();
		}
	}
	init();
}
/*
@param {
        target,
        classes
} prop 
*/

UIComponent.Tabmenu = function(prop){
    var _self = this;
    var _menus = [];
    var _contents = [];
    var _contentObj = {};
    var _target = null;
    var _index = 0;
	var _contentContainer =null;

    function init(){
        setTarget();
        setMenus();
		setContentContainer();
    }

    function setTarget(){
        _target = prop['target'];
    }

    function setMenus(){
        _menus = _target.getElementsByTagName('button');
        for( var i=0;i<_menus.length;i++){
            var __content_name = _menus[i].getAttribute('data-target');
            
            _menus[i].index =  i;
            _menus[i].addEventListener("click",function(e){
                onButtonClickHandler(e);
            });

			setContents(__content_name,i);
        }
    }

	function setContentContainer(){
		var __containerName = _target.getAttribute('data-contents');

		if( __containerName == null || __containerName == undefined){
			UIComponent.log("탭메뉴의 컨텐츠 그룹이 지정되지 않았습니다.");
			return null;
		}
		var __container = document.querySelectorAll('[data-name="'+__containerName+'"]');
		if(__container.length > 1){
			UIComponent.log("탭메뉴의 컨텐츠 그룹이 다수 입니다. 컨텐츠 그룹은 단 한개여야 합니다.");
			return null;
		}
		_contentContainer = document.querySelectorAll('[data-name="'+__containerName+'"]')[0];
	}

    function onButtonClickHandler(e){
        var __menu = e.target;
        var __index = __menu.index;
        _self.setIndex(__index);
    }

    function setContents(content_name,index){
        var __content = document.querySelectorAll('[data-name="'+content_name+'"]');
		var __contentEl = __content[0];
		if(__content.length>1) return null;
        _contents[index] = _contentObj[content_name] = __contentEl;
    }

    this.getMenuByIndex = function(index){
        if(index < _menus.length-1) return _menus[i]
        return null;
    }

    this.getContentByIndex = function(index){
        if(index < _contents.length-1) return _contents[i]
        return null;
    }

    this.getContentByName = function(name){
		try{
			if(_contentObj[name].length > 0) return _contentObj[name];
		}
        catch(e){
			UIComponent.log(e.message);
		}
        return null;
    }

    this.setIndex = function(index){
        for( var i=0;i<_menus.length;i++){
            try{
                if(index ==  i){
                    _index = i;
                    _menus[i].classList.add("active");
                    _contents[i].classList.add("active");
                }
                else{
                    _menus[i].classList.remove("active");
                    _contents[i].classList.remove("active");
                }
            }
            catch(e){
				UIComponent.log(e.message);
            }
            
        }
    }

    this.getIndex = function (){
        return _index;
    }

    init();
}
/*
@param {
        target,
        class
} prop 
*/
UIComponent.Toggle = function(prop){
    var _self = this;
    var _target = null;
    var _class = null;
    var _toggleTarget = null;

    function init(){
        setClass();
        setTarget();
        setToggleTarget();
    }

    function setTarget(){
        _target = prop['target'];
        _target.module = _self;
        _target.addEventListener("click",function(e){
            onClickHandler(e);
        });
    }

    function setToggleTarget(){
        var __toggleTargetName = _target.getAttribute("data-target");
        if(__toggleTargetName == null || __toggleTargetName == undefined) return null;
        
        _toggleTarget = document.querySelectorAll('[data-name="'+__toggleTargetName+'"]')[0];
    }

    function onClickHandler(e){
        if( _class != null && _class != undefined){
            if( _target.hasClass(_class) ){
                _target.classList.remove(_class);
                if(_toggleTarget != null){
                    _toggleTarget.classList.remove(_class);
                }
            }
            else{
                _target.classList.add(_class);
                if(_toggleTarget != null){
                    _toggleTarget.classList.add(_class);
                }
            }

            _target.dispatchEvent(UIComponent.Event.toggleClass);
        }
    }

    function setClass(){
        _class = prop['class'];
    }

    this.accept = function (visitor) {
        visitor.visit(_self);
    };

    init();
}
UIComponent.Toast = {};
/**
 * message : 출력 메시지
 * option : { left, top }
 */
UIComponent.Toast.Message = function(message,option){
	var _self = this;
	var _el = null;
    var _span = null;
    var _body = document.getElementsByTagName('body')[0];
    var _option = option;

    function init(){
        createEl();
        setMessage();
        setOption();
        setTimeoutfn();
    }

    function createEl(){
        _el = document.createElement('div');
        _el.classList.add('toast');
        _el.classList.add('message');

        _span = document.createElement('span');
        _el.appendChild(_span);

        _body.appendChild(_el);
    }

    function setMessage(){
        _span.innerHTML = message;
    }

    function setOption(){
        if ( _option == undefined || _option == null) return null;
        var _position = _option["position"];
        if ( _option == undefined || _option == null) return null;
        if(_position.top != undefined){
            _el.style.top = _position.top;
        }

        if(_position.bottom != undefined){
            _el.style.bottom = _position.bottom;
        }
    }

    function setTimeoutfn(){
        setTimeout(function(){
            _el.classList.add('show');  
        },100);

        setTimeout(function(){
            _el.classList.remove('show'); 
            _el.classList.add('hide');  
        },4000);

        setTimeout(function(){
            _self.destroy();
        },5000);
    }

    this.destroy = function(){
        if(_el){
            _body.removeChild(_el);
            _el = null;
            _self = null;
        }
    }

	init();
};


/**
 * @param = {}
 * target: 대상 (element)
 * duration: 지속시간
 * data: 데이터
 * order : 정렬 방법 asc(오름),des(내림),shuffle(무작위)
 */
 UIComponent.ChangeStopNum = function(prop){
	var _self = this;
	var _target = null;
	var _data = null;
	var _order = "asc";
	var _collect = [0,1,2,3,4,5,6,7,8,9];

	var _digitInterval = null;
	var _digitIntervalDelay = 50;

	var _digitTimeout = null;
	var _duration = null;

	function init(){
		setTarget();
		setData();
		setOrder();
		setEvent();
		setDuration();
		setDigitInterval();
	}

	function setTarget(){
		_target = prop['target'];
		_target.module = _self;
	}

	function setData(){
		_data = prop['data'];
	}

	function setOrder(){
		if(prop['order'] == null && prop['order'] == undefined) return null;
		_order = prop['order'];
		if( _order == "des"){
			_collect.reverse();
		}
		else if(_order == "shuffle"){
			_collect = UIComponent.Common.shuffleArray([0,1,2,3,4,5,6,7,8,9]);
		}
	}

	function setEvent(){
		_target.addEventListener("finished",function(e){
			onFinishHandler(e);
		});
	}

	function setDuration(){
		_duration = prop['duration'];
		_digitTimeout = setTimeout(function(){
			_target.dispatchEvent(UIComponent.Event.finished);
		},_duration);

		console.log("setDuration",_duration);
	}

	function setDigitInterval(){
		var __cnt = 0;
		_digitInterval = setInterval(function(){
			__cnt ++;
			if( __cnt >= 10){
				__cnt = 0;
			}
			_target.innerHTML = _collect[__cnt];
		},_digitIntervalDelay);

		console.log("setDigitInterval",_digitIntervalDelay);
	}

	function onFinishHandler(e){
		clearInterval(_digitInterval);
		clearTimeout(_digitTimeout);
		_digitInterval = null;
		_digitTimeout = null;
		_target.innerHTML = _data;
	}

	this.play = function(){
		if(_digitTimeout) clearTimeout(_digitTimeout);
		if(_digitInterval) clearInterval(_digitInterval);

		setDuration();
		setDigitInterval();
	}

	this.stop = function(){
		_target.dispatchEvent(UIComponent.Event.finished);
	}

	this.data = function(data){
		_data = data;
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	init();
}
/**
 * @param = {}
 * target: 대상 (element)
 * duration: 지속시간
 * data: 데이터
 */
 UIComponent.ChangeStopNumbers = function(prop){
	var _self = this;
	var _target = null;
	var _data = null;
    var _items = [];
    var _duration = 100;

	function init(){
		setTarget();
		setData();
        createItem();
	}

	function setTarget(){
		_target = prop['target'];
		_target.module = _self;
	}

	function setData(){
		_data = prop['data'];
        _target.innerHTML = "";
	}

    function createItem(){
        var __cnt = 0;
        var __NumData = UIComponent.Common.removeCommas(_data);

        for( var i=0;i<_data.length;i++){
            var __digit = _data.substring(i,i+1);
            var __el = document.createElement('span');
			__el.innerHTML = __digit;
            _target.appendChild(__el);

            if(__digit == ",") continue;

            var __duration = _duration * (__NumData.length-__cnt);
            var __item = new UIComponent.ChangeStopNum({
                'target':__el,
                'duration':__duration,
                'data':_data[i],
                'order':'shuffle'   // asc,des,shuffle
            });
            _items.push(__item);

            __cnt++;
        }
    }

	this.play = function(){
        for( var i=0;i<_items.length;i++){
            _items[i].play();
        }
	}

	this.stop = function(){
        for( var i=0;i<_items.length;i++){
            _items[i].stop();
        }
	}

	this.data = function(data){
		_data = data;
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	init();
}
/**
 * @param = {}
 * target: 대상 (element)
 * duration: 지속시간
 * data: 데이터
 * disit: 자릿수
 * order : 정렬 방법 asc(오름),des(내림),shuffle(무작위)
 * move : 스크롤 방향 up,down
 */
 UIComponent.ScrollStopNum = function(prop){
	var _self = this;

	/** option */
	var _target = null;
	var _duration = null;
	var _data = null;
	var _digit = 0;
	var _order = "asc";
	var _move = "down";
	var _collect = [0,1,2,3,4,5,6,7,8,9];
	/***********/

	var _containerEl=null;	
	var _itemHeight = 0;
	
	var _moveTimeout = null;
	var _finishTimeout = null;

	function init(){
		setOption();
		setOrder();
		setEvent();

		setTimeout(function(){
			_self.play();
		},10);
	}

	function setOption(){
		_target = prop['target'];
        _target.style.position = 'relative';
        _target.style.display = 'inline-block';
        _target.style.overflow = 'hidden';
		_target.module = _self;
		_target.innerHTML = '';

		_duration = prop['duration'];
		_data = prop['data'];
		_digit = prop['digit'];
		_order = prop['order'];
		_move = prop['move'];
	}

	function setOrder(){
		if(_order == null && _order == undefined) return null;

		if( _order == "des"){
			if( _move == "down" ){
				_collect.reverse();
			}
		}
		else if( _order == "asc"){
			if( _move == "up" ){
				_collect.reverse();
			}
		}
		else if(_order == "shuffle"){
			_collect = UIComponent.Common.shuffleArray([0,1,2,3,4,5,6,7,8,9]);
		}
	}

	function setEvent(){
		_target.addEventListener("finished",function(e){
			onFinishHandler(e);
		});
	}

	function onFinishHandler(e){
		_target.innerHTML = _data;
	}

	function createContainer(){
		_containerEl = document.createElement('span');
		_containerEl.style.position = 'relative';
		_containerEl.style.display = 'block';
		_containerEl.style.left = '0';
		_containerEl.style.transition = 'none';

		_target.appendChild(_containerEl);
	}

	function createScrollEl(){
		for( var i=0;i<=_digit;i++){
			for( var j=0;j<_collect.length;j++){
				var _span = document.createElement('span');
				_span.style.display = 'block';
				_span.innerHTML = _collect[j];

				if( _move == "down"){
					_containerEl.prepend(_span);
				}
				else if( _move == "up"){
					_containerEl.appendChild(_span);
				}
				

				if(i==0 && j==0){
					_target.style.width = (_span.clientWidth) + "px";
					_target.style.height = _span.clientHeight + "px";
					_itemHeight = _span.clientHeight;
				}

				if( i == (_digit) && _data ==  _collect[j]){
					setStartPosition();
					break;
				}
			}
		}
	}

	function setStartPosition(){
		_containerEl.style.transition = 'none';
		
		if(_move == "down"){
			var __top = _containerEl.clientHeight - _itemHeight;
			_containerEl.style.top = -__top +'px';
		}
		else if(_move == "up"){
			_containerEl.style.top = '0px';
		}
		
	}

	this.play = function(){

		if(_moveTimeout) clearTimeout(_moveTimeout);
		if(_finishTimeout) clearTimeout(_finishTimeout);
		_target.innerHTML = '';

		createContainer();
		createScrollEl();
		setStartPosition();

		_moveTimeout = setTimeout(function(){
			_containerEl.style.transition = 'all 1s cubic-bezier(0.075, 0.820, 0.165, 1.000)';
			
			if(_move == "down"){
				_containerEl.style.top = '0px';
			}
			else if(_move == "up"){
				var __top = _containerEl.clientHeight - _itemHeight;
				_containerEl.style.top = -__top +'px';
			}
		},100);

		_finishTimeout = setTimeout(function(){
			_target.dispatchEvent(UIComponent.Event.finished);
		},1000)
	}

	this.stop = function(){
		_target.dispatchEvent(UIComponent.Event.finished);
	}

	this.data = function(data){
		_data = data;
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	init();
}
/**
 * @param = {}
 * target: 대상 (element)
 * duration: 지속시간
 * data: 데이터
 */
 UIComponent.ScrollStopNumbers = function(prop){
	var _self = this;
	var _target = null;
	var _data = null;
    var _items = [];
    var _duration = 300;

	function init(){
		setTarget();
		setData();
        createItem();
	}

	function setTarget(){
		_target = prop['target'];
		_target.style.display = 'inline-flex';
		_target.module = _self;
	}

	function setData(){
		_data = prop['data'];
        _target.innerHTML = "";
	}

    function createItem(){
        var __cnt = 0;
        var __NumData = UIComponent.Common.removeCommas(_data);

        for( var i=0;i<_data.length;i++){
            var __digit = _data.substring(i,i+1);
            var __el = document.createElement('span');
			__el.innerHTML = __digit;
            _target.appendChild(__el);

            if(__digit == ",") continue;

            var __duration = _duration * (__NumData.length-__cnt);
            var __item = new UIComponent.ScrollStopNum({
                'target':__el,
                'duration':__duration,
                'data':_data[i],
                'digit':__cnt+1,
                'order':'asc',      // asc,des,shuffle
                'move' :"down"      // up,down
            });
            _items.push(__item);

            __cnt++;
        }
    }

	this.play = function(){
        for( var i=0;i<_items.length;i++){
            _items[i].play();
        }
	}

	this.stop = function(){
        for( var i=0;i<_items.length;i++){
            _items[i].stop();
        }
	}

	this.data = function(data){
		_data = data;
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	init();
}
/**
 * @param = {}
 * target: 대상 (element)
 * class : 클래스
 */
 UIComponent.Scrollable = function(prop){
	var _self = this;

	/** option */
	var _target = null;
	var _class = null;
	/***********/

    var _opened = false;
    var _anime = null;
    var _duration = 300;

	function init(){
		setOption();
        setEvent();
	}

	function setOption(){
		_target = prop['target'];
		_class = prop['class'];
	}

    function setEvent(){

        _target.addEventListener("touchend",function(e){
            onUpHandler(e);
        });

        _target.addEventListener("mouseup",function(e){
            onUpHandler(e);
        });
    }

    function onUpHandler(e){
        var _leftPer = UIComponent.Common.getScrollLeftPosition(_target);

        if(_opened){
            if(_leftPer < 90){
                _self.close();
            }
            else{
                _self.open();
            }
        }
        else{
            if(_leftPer > 10){
                _self.open();
            }
            else{
                _self.close();
            }
        }
    }

    this.open = function(){
        if( _anime ){
            _anime.remove();
        }
        _target.dispatchEvent(UIComponent.Event.open);
        _opened = true;
        var _scrollleft = _target.clientWidth;
        _anime = anime({
            targets: _target,
            scrollLeft: _scrollleft,
            duration: _duration,
            easing: 'easeOutQuad'
        });

        console.log("####",_scrollleft);
    }

    this.close = function(){
        if( _anime ){
            _anime.remove();
        }
        _target.dispatchEvent(UIComponent.Event.close);
        _opened = false;
        var _scrollleft = 0;
        _anime = anime({
            targets: _target,
            scrollLeft: _scrollleft,
            duration: _duration,
            easing: 'easeOutQuad'
        });
        console.log("####",_scrollleft);
    }

	init();
}
/*
 * prop = {target}
 */
UIComponent.PwPoint = function(prop){
    var _self     = this;
    var _target   = null;
    var _name     = null;
    var _input    = null;
    var _points = [];

    function init(){
        setTarget();
        setInput();
    }

    function setTarget(){
		_target = prop['target'];
		_target.module = _self;
        _points = _target.getElementsByTagName('span');
	}

    function setInput(){
        _name = _target.getAttribute('data-target');
		_input = document.querySelectorAll('[data-name="'+_name+'"]')[0];
        _input.addEventListener("change",function (e){
			onChangeHandler(e);
		});

        _input.addEventListener("input",function (e){
			onChangeHandler(e);
		});
	}

    function onChangeHandler(e){
        var _length = _input.value.length;

        for( var i=0;i<_points.length;i++){
            if( i < _length){
                _points[i].classList.add("point-active") ;
            }
            else{
                if(_points[i]){
                    _points[i].classList.remove("point-active") ;
                }
            }
        }
        console.log("#####",_length);
	}

    init();
}
UIComponent.TooltipGroup = (function() {
	var _instance;
	var _tooltips = [];

	function initiate() {
		return {
			'visit':function (tooltip) {
                if(_tooltips.indexOf(tooltip) < 0){
                    _tooltips.push(tooltip);
                    setEvent(tooltip);
                }
            }
		};
	}

	function setEvent(tooltip){
        var __el = tooltip.getElement();
        __el.addEventListener("tooltipShow",function(e){
            onShowHandler(e);
        });
    }

    function onShowHandler(e){
        var __target = e.target;

        for( var i=0;i<_tooltips.length;i++){
            if(__target.getAttribute("data-tooltip-group") == _tooltips[i].getElement().getAttribute("data-tooltip-group")){
                var __el = _tooltips[i].getElement();
                if(e.target != __el){
                    _tooltips[i].hide();
                }
            }
        }
    }

	return {
		getInstance: function() {
			if (!_instance) {
				_instance = initiate();
			}
			return _instance;
		}
	}
})();
/*
prop : Element
 */
UIComponent.PopupController = (function() {
	var _instance;
	var _showItems=[];
	function initiate(target) {
		return {
			'name':"popupController",
			'target':target,
			'popupWrap':null,
			'popupDimmend':null,
			'items':[],
			'add' : function(item){
				var _self = this;
				if(this.items.indexOf(item) < 0)  {
					this.items.push(item);
					item.getTarget().addEventListener("popupOpen",function(e){
						onPopupOpenHandler(e,item);
						_self.popupWrap.appendChild(item.getTarget());
					});
					item.getTarget().addEventListener("popupClose",function(e){
						onPopupCloseHandler(e,item);
						_self.popupWrap.removeChild(item.getTarget());
					});
				}
			},
			'remove' : function(item){
				if(this.items.indexOf(item) > -1)  {
					var __index = this.items.indexOf(item);
					this.items.splice(__index, 1);
				}
			},
			'show' : function(){
				if(this.target == null) return null;
				this.target.style.display = 'block';
				document.getElementsByTagName('html')[0].classList.add("popup-view");
			},
			'hide' : function(){
				if(this.target == null) return null;
				this.target.style.display = 'none';
				document.getElementsByTagName('html')[0].classList.remove("popup-view");
			},
			'init' : function(){
				var _self = this;

				function createPopupWrap(){
					_self.popupWrap = document.createElement("div");
					_self.popupWrap.className = "popup-wrap";
					_self.target.appendChild(_self.popupWrap);
				}

				function createDimmend(){
					_self.popupDimmend = document.createElement("div");
					_self.popupDimmend.className = "popup-dimmend";
					_self.target.appendChild(_self.popupDimmend);
				}

				createPopupWrap();
				createDimmend();
			}	
		};
	}
	function onPopupOpenHandler(e,item){
		//console.log("onPopupOpen:",item.name);
		add(item);
	}

	function onPopupCloseHandler(e,item){
		//console.log("onPopupClose:",item.name);
		remove(item);
	}
	function add(item){
		if(_showItems.indexOf(item) < 0)  {
			_showItems.push(item);
			UIComponent.PopupController.getInstance().show();
		}
	}
	function remove(item){
		if(_showItems.indexOf(item) > -1)  {
			var __index = _showItems.indexOf(item);
			_showItems.splice(__index, 1);
			if(_showItems.length == 0){
				UIComponent.PopupController.getInstance().hide();
			}
		}
	}
	return {
		getInstance: function(el) {
			if (!_instance) {
				_instance = initiate(el);
				_instance.init();
				_instance.hide();
			}
			return _instance;
		}
	}
})();
/*
@param {
		target,
		class,
		marginTop,
} prop 
*/
UIComponent.TabScroller = function(prop){
	var _self = this;
	var _target = null;
	var _class = null;
	var _tabButton = null;
	var _offsetTop = null;
	var _last_known_scroll_position = 0;
	var _ticking = false;
	var _marginTop = 200;

	function init(){
		setClass();
		setMarginTop();
		setTarget();
		setTabButton();
	}

	function setTarget(){
		_target = prop['target'];
		_target.module = _self;
		_offsetTop = window.pageYOffset + _target.getBoundingClientRect().top;
	}

	function setTabButton(){
		var __tabButtonName = _target.getAttribute("data-target");
		if(__tabButtonName == null || __tabButtonName == undefined) return null;

		_tabButton = document.querySelectorAll('[data-name="'+__tabButtonName+'"]')[0];
		_tabButton.addEventListener("click",function(e){
			setTimeout(function(){
				const ___to = _offsetTop - _marginTop + 10;
				window.scrollTo(0,___to);
				setScrollTop();
			},10);
		});

		setEvent();
	}

	function setEvent(){
		window.addEventListener('scroll', function(e) {
			_last_known_scroll_position = window.scrollY;
		
			if (!_ticking) {

				window.requestAnimationFrame(function() {
					onScrollHandler(_last_known_scroll_position);
					_ticking = false;
				});
		  
				_ticking = true;
			}
		});
	}

	function setClass(){
		_class = prop['class'];
	}

	function setMarginTop(){
		if(prop['marginTop'] == null || prop['marginTop'] == undefined) return null;
		_marginTop = prop['marginTop'];
	}

	function onScrollHandler(scroll_pos) {
		_offsetTop = window.pageYOffset + _target.getBoundingClientRect().top;
		setScrollTop(scroll_pos);
	}

	function setScrollTop(scroll_pos){
		const _top = (scroll_pos == undefined)?window.scrollY:scroll_pos;
		const _scrollRangeBefore = Math.floor(_offsetTop - _marginTop);
		const _scrollRangeAfter = Math.ceil(_target.offsetHeight + _offsetTop - _marginTop);
		
		if( _top > _scrollRangeBefore && _top < _scrollRangeAfter){
			_tabButton.classList.add('active');
			
			let _tabParent = _tabButton.parentNode.parentNode;
			let _tabW =_tabButton.offsetLeft + (_tabButton.offsetWidth/2);
			let _tx = _tabW - (window.innerWidth/2);

			if( _tabParent.scrollLeft > _tabButton.offsetLeft - (window.innerWidth/3)){
				let _leftTx = _tabButton.offsetLeft - (window.innerWidth/2);
				_tabParent.scrollTo(_leftTx,0);
			}
			else if(_tabParent.scrollLeft < _tx){
				_tabParent.scrollTo(_tx,0);
			}
		}
		else{
			_tabButton.classList.remove('active');
		}
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	init();
}
/*
@param {
		target,
		latitude, (top,middle,bottom)
} prop 
*/
UIComponent.ScrollPositionController = function(prop){
	var _self = this;
    var _target = null;
	var _latitude = 'bottom';
	var _isScreenIn = false;

	var _height = 0;
	var _startTop = 0;
	var _scrollRange = {'min':0,'max':0};

	function init(){
        setTarget();
		setLatitude();
        setScrollEvent();
        setScreenInOutEvent();
		setScreenOnEvent();

		setLoc();
	}

    function setTarget(){
		_target = prop['target'];
		_target.module = _self;
	}

	function setLatitude(){
		if( prop['latitude'] == null || prop['latitude'] == undefined) return null;
		_latitude = prop['latitude'];
	}

	function setScrollEvent(){
		window.addEventListener('scroll',onScrollEvent);
	}

	function onScrollEvent(e){
		/*
		console.log("----------------------------------------");
		console.log("@@@@@ scrolltop",window.scrollY);
		console.log("@@@@@ target top",_target.offsetTop);
		console.log("@@@@@ _startTop",_startTop);
		console.log("@@@@@ _scrollRange min",_scrollRange['min']);
		console.log("@@@@@ _scrollRange max",_scrollRange['max']);
		console.log("----------------------------------------");
		*/

		if( window.scrollY > _scrollRange['min'] && window.scrollY < _scrollRange['max']){
			if(!_isScreenIn){
				_isScreenIn = true;
				_target.dispatchEvent(UIComponent.Event.screenIn);
			}

			_target.dispatchEvent(UIComponent.Event.screenOn);
		}
		else{
			if(_isScreenIn){
				_isScreenIn = false;
				_target.dispatchEvent(UIComponent.Event.screenOut);
			}
		}
	}

	function setScreenInOutEvent(){
		_target.addEventListener('screenIn', onScreenInHandler);
		_target.addEventListener('screenOut', onScreenOutHandler);
	}

	function onScreenInHandler(e){
		//console.log("## onScreenInHandler");
	}

	function onScreenOutHandler(e){
		//console.log("## onScreenOutHandler");
	}

	function setScreenOnEvent(){
		_target.addEventListener('screenOn', onScreenOnHandler);
	}

	function onScreenOnHandler(e){
		//console.log("## onScreenOnHandler");
	}

	function setLoc(){
		_self.update();
	}

	this.update = function(){
		_height = Math.floor( _target.offsetHeight );
		var _offsetTop = window.pageYOffset + _target.getBoundingClientRect().top;

		if(_latitude == 'top'){
			_startTop = Math.floor( _offsetTop - window.outerHeight);
		}
		else if(_latitude == 'middle'){
			_startTop = Math.floor( _offsetTop - (window.outerHeight/2) );
		}
		else if(_latitude == 'bottom'){
			_startTop = Math.floor( _offsetTop);
		}

		_scrollRange['min'] = Math.floor( _offsetTop - window.outerHeight);
		_scrollRange['max'] = Math.floor( _offsetTop) + Math.floor( _target.offsetHeight );
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	this.getRange = function(){
		return _scrollRange;
	}

	init();
}
/*
UIComponent.Html.reset();
*/

UIComponent.Html = (function(){
	var _instance = null;
	function init(){
		_instance = {
			reset:function(){
				setInputText();
				setSelectBox();
				setAccordion();
				setTooltip();
				setTabmenu();
				setTooltipGroup();
				setToggle();
				setChangeStopNum();
				setChangeStopNumbers();
				setScrollStopNum();
				setScrollStopNumbers();
				setScrollable();
				setPwPoint();
				setTabScroller();
				setScrollPositionController();
			}
		}
		_instance.reset();
		return _instance;
	}

	function setInputText(){
		var items = $('.inp-box');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				var __input = $(__item).find('input')[0];
				var __placeholder = $(__item).find('.inp-tit')[0];
				var __clearButton = $(__item).find('.icon-close')[0];
				
				var _inpt = new UIComponent.InputText(
					{
						'target':__input,
						'placeholder':__placeholder,
						'clearButton':__clearButton,
					}
				);
				__item.classList.add("initiate");
			}
		}
	}

	function setSelectBox(){
		console.log("setSelectBox");
		var items = $('.select-box');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				var __select = $(__item).find('select')[0];
				var __placeholder = $(__item).find('.inp-tit')[0];
				
				var _inpt = new UIComponent.SelectBox(
					{
						'target':__select,
						'placeholder':__placeholder,
					}
				);
				__item.classList.add("initiate");
			}
		}
	}

	function setAccordion(){
		console.log('setAccordion');
		var items = $('.accordion-wrap');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				__item.module = new UIComponent.Accordion(
					{
						'target':__item
					}
				);
				__item.classList.add("initiate");
			}
		}

		var _items = document.querySelectorAll('[data-module="accordion"]');
		for( var j=0;j<_items.length;j++){
			var __item = _items[j];
			if( !__item.hasClass("initiate") ){
				__item.module = new UIComponent.Accordion({
					'target':__item
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setTooltip(){
		var items = document.querySelectorAll('[data-module="tooltip"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				__item.module = new UIComponent.Tooltip({
					'target':__item
				});
				__item.classList.add("initiate");
			}

			setTooltipButton(__item);
		}
	}

	function setTooltipButton(target){
		var __name = target.getAttribute("data-name");
		var __buttons = document.querySelectorAll('[data-target="'+__name+'"]');
		for(var i=0;i<__buttons.length;i++){
			__buttons[i].addEventListener("click",function(){
				target.module.show();
			});
		}
	}

	function setTooltipGroup(){
		var items = document.querySelectorAll('[data-module="tooltip"]');

		for( var i=0;i<items.length;i++){
			var __item = items[i];
			UIComponent.TooltipGroup.getInstance().visit(__item.module);
		}
	}

	function setTabmenu(){
		console.log('setTabmenu');
		var items = document.querySelectorAll('[data-module="tabmenu"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				new UIComponent.Tabmenu({
					'target':__item
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setToggle(){
		console.log('setToggle');
		var items = document.querySelectorAll('[data-module="toggle"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				new UIComponent.Toggle({
					'target':__item,
					'class' : 'active'
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setChangeStopNum(){
		console.log('setChangeStopNum');
		var items = document.querySelectorAll('[data-module="changeStopNum"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				new UIComponent.ChangeStopNum({
					'target':__item,
					'duration' : '1000',
					'data':'8'
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setChangeStopNumbers(){
		console.log('setChangeStopNumbers');
		var items = document.querySelectorAll('[data-module="changeStopNumbers"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				var __value = __item.getAttribute("data-value");
				new UIComponent.ChangeStopNumbers({
					'target':__item,
					'duration' : '1000',
					'data':__value,
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setScrollStopNum(){
		console.log('setScrollStopNum');
		var items = document.querySelectorAll('[data-module="scrollStopNum"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				new UIComponent.ScrollStopNum({
					'target':__item,
					'duration' : '1000',
					'data':'8'
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setScrollStopNumbers(){
		console.log('setScrollStopNumbers');
		var items = document.querySelectorAll('[data-module="scrollStopNumbers"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				var __value = __item.getAttribute("data-value");
				new UIComponent.ScrollStopNumbers({
					'target':__item,
					'duration' : '1000',
					'data':__value,
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setScrollable(){
		console.log('setScrollable');
		var items = document.querySelectorAll('[data-module="scrollable"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				new UIComponent.Scrollable({
					'target':__item
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setPwPoint(){
		console.log('setPwPoint');
		var items = document.querySelectorAll('[data-module="pwPoint"]');
		for( var i=0;i<items.length;i++){
			var __item = items[i];
			if( !__item.hasClass("initiate") ){
				new UIComponent.PwPoint({
					'target':__item
				});
				__item.classList.add("initiate");
			}
		}
	}

	function setTabScroller(){
		console.log('setTabScroller');
		var __items = document.querySelectorAll('[data-module="tabScroller"]');
		for( var i=0;i<__items.length;i++){
			var __item = __items[i];
			var __marginTop = __item.getAttribute('data-margintop');

			if( __marginTop == undefined || __marginTop == null){
				if( $(__item).closest('.CMYMCP132').length > 0){
					__marginTop = 220;
				}
	
				if( $(__item).closest('.CMYMCP171').length > 0){
					__marginTop = 220;
				}
	
				if( $(__item).closest('.CMYMGA001').length > 0){
					__marginTop = 120;
				}
			}

			if( !__item.hasClass("initiate") ){
				new UIComponent.TabScroller({
					'target':__item,
					'marginTop':__marginTop,
				});
				__item.classList.add("initiate");
			}

			if(i == __items.length-1){
				var __lastItemHiehgt = __item.offsetHeight;
				if(__lastItemHiehgt < (window.innerHeight * 0.8)){
					__item.style.marginBottom = ( window.innerHeight - __lastItemHiehgt - 320) + "px";
				}
			}
		}
	}

	function setScrollPositionController(){
		console.log('ScrollPositionController');
		var __items = document.querySelectorAll('[data-module="ScrollPositionController"]');
		for( var i=0;i<__items.length;i++){
			var __item = __items[i];
			var __latitude = __item.getAttribute('data-latitude');
			if( !__item.hasClass("initiate") ){
				new UIComponent.ScrollPositionController({
					'target':__item,
					'latitude':__latitude,
				});
				__item.classList.add("initiate");
			}
		}
	}

	if(_instance){
		return _instance;
	}
	else{
		return init();
	}
})();

$(document).ready(function(){
	UIComponent.Html.reset();

	// 화면 ID 확인용 스크립트 입니다. 
	var _urls = window.location.href.split('/');
	var _flleName = _urls[_urls.length-1];
	$(".content-header").on("click",function(){
		alert(_flleName);
	});
});