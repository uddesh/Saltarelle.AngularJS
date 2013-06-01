﻿(function() {
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.AccordionController
	var $TestAngularJS_AccordionController = function(_scope, iElement, iAttrs, acontroller) {
		//System.Diagnostics.Debug.Break();
	};
	$TestAngularJS_AccordionController.prototype = {
		clickme: function() {
			window.alert('clicked');
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.AccordionDefinition
	var $TestAngularJS_AccordionDefinition = function() {
		AngularJS.DirectiveDefinition.call(this);
		this.Name = 'accordion';
		this.Restrict = 3;
		this.Replace = true;
		this.Transclude = true;
		this.Template = '<div><div ng-click=\'clickme()\'>CLICCAMI</div><div ng-transclude></div></div>';
		//Template = @"<div ng-transclude></div>";
		this.SharedController = $TestAngularJS_AccordionSharedController;
		this.DirectiveController = $TestAngularJS_AccordionController;
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.AccordionSharedController
	var $TestAngularJS_AccordionSharedController = function() {
		this.pppp = null;
		this.expanders = [];
		//Window.Alert("muuuu");
		this.pppp = 'constructor ok';
	};
	$TestAngularJS_AccordionSharedController.prototype = {
		clickme: function() {
			window.alert('clicked');
		},
		gotOpened: function(selectedExpander) {
			//Window.Alert(pppp);
			for (var $t1 = 0; $t1 < this.expanders.length; $t1++) {
				var o = this.expanders[$t1];
				if (!ss.referenceEquals(selectedExpander, o)) {
					o.showMe = false;
				}
			}
		},
		addExpander: function(expander) {
			ss.add(this.expanders, expander);
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.CartController
	var $TestAngularJS_CartController = function(_scope, Items) {
		this.items = null;
		this.billDiscount = 0;
		AngularJS.Scope.call(this);
		this.zeroitems();
		this.items = Items;
		this.$watch(ss.mkdel(this, this.totalCart), ss.mkdel(this, this.calculateDiscount));
	};
	$TestAngularJS_CartController.prototype = {
		zeroitems: function() {
			this.items = null;
		},
		remove: function(index) {
			ss.removeAt(this.items, index);
		},
		totalCart: function() {
			var total = 0;
			for (var i = 0; i < this.items.length; i++) {
				total = total + this.items[i].price * this.items[i].quantity;
			}
			return total;
		},
		subtotal: function() {
			return this.totalCart() - this.billDiscount;
		},
		calculateDiscount: function(newValue, oldValue) {
			this.billDiscount = ((newValue > 100) ? 10 : 0);
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.CartItem
	var $TestAngularJS_CartItem = function() {
		this.title = null;
		this.quantity = 0;
		this.price = 0;
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.DirectivesExample
	var $TestAngularJS_DirectivesExample = function() {
	};
	$TestAngularJS_DirectivesExample.Main = function() {
		var app = angular.module('myApp', []);
		AngularJS.AngularUtils.RegisterDirective(app, new $TestAngularJS_AccordionDefinition());
		AngularJS.AngularUtils.RegisterDirective(app, new $TestAngularJS_ExpanderDefinition());
		AngularJS.AngularUtils.RegisterDirective(app, new $TestAngularJS_HelloDirective());
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.ExpanderController
	var $TestAngularJS_ExpanderController = function(_scope, iElement, iAttrs, acontroller) {
		this.title = null;
		this.showMe = false;
		this.accordionController = null;
		this.accordionController = acontroller;
		this.showMe = false;
		this.accordionController.addExpander(this);
	};
	$TestAngularJS_ExpanderController.prototype = {
		toggle: function() {
			this.showMe = !this.showMe;
			this.accordionController.gotOpened(this);
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.ExpanderDefinition
	var $TestAngularJS_ExpanderDefinition = function() {
		AngularJS.DirectiveDefinition.call(this);
		this.Name = 'expander';
		this.Restrict = 1;
		this.Replace = true;
		this.Transclude = true;
		this.Require = this.RequireDirective('accordion', true, false);
		this.ScopeMode = 2;
		ss.add(this.ScopeAttributes, new AngularJS.ScopeBindings.$ctor2('title', 0, 'expanderTitle'));
		this.Template = '<div>\r\n                         <div class=\'title\' ng-click=\'toggle()\'>{{title}}</div>\r\n                         <div class=\'body\' ng-show=\'showMe\' ng-transclude></div>\r\n                      </div>';
		this.DirectiveController = $TestAngularJS_ExpanderController;
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.Filters
	var $TestAngularJS_Filters = function(LabelEuro) {
		this.$le = null;
		this.$le = LabelEuro;
	};
	$TestAngularJS_Filters.prototype = {
		euro: function(input) {
			return input.toString() + ' euros (' + this.$le + ')';
		},
		dracma: function(input) {
			return input.toString() + ' dracmas ';
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.FundingExample
	var $TestAngularJS_FundingExample = function() {
	};
	$TestAngularJS_FundingExample.Main = function() {
		var app = angular.module('myApp', []);
		AngularJS.AngularUtils.RegisterController(app, $TestAngularJS_StartUpController);
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.HelloDirective
	var $TestAngularJS_HelloDirective = function() {
		AngularJS.DirectiveDefinition.call(this);
		this.Name = 'hello';
		this.Restrict = 7;
		this.Template = '<div>Hello <span ng-transclude></span>!</div>';
		this.Replace = true;
		this.ScopeMode = 2;
		this.Transclude = true;
		ss.add(this.ScopeAttributes, new AngularJS.ScopeBindings.$ctor1('title', 2));
	};
	$TestAngularJS_HelloDirective.prototype = {
		Link: function(scope, iElement, iAttrs) {
			//System.Diagnostics.Debug.Break();
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.ItemsFactory
	var $TestAngularJS_ItemsFactory = function() {
	};
	$TestAngularJS_ItemsFactory.Items = function() {
		var items = [];
		var $t1 = new $TestAngularJS_CartItem();
		$t1.title = 'AAAA';
		$t1.quantity = 1024;
		$t1.price = 44.95;
		ss.add(items, $t1);
		var $t2 = new $TestAngularJS_CartItem();
		$t2.title = 'BBBB';
		$t2.quantity = 2048;
		$t2.price = 55.95;
		ss.add(items, $t2);
		var $t3 = new $TestAngularJS_CartItem();
		$t3.title = 'CCCC';
		$t3.quantity = 4096;
		$t3.price = 66.95;
		ss.add(items, $t3);
		var $t4 = new $TestAngularJS_CartItem();
		$t4.title = 'dddd';
		$t4.quantity = 1024;
		$t4.price = 44.95;
		ss.add(items, $t4);
		var $t5 = new $TestAngularJS_CartItem();
		$t5.title = 'eeee';
		$t5.quantity = 2048;
		$t5.price = 55.95;
		ss.add(items, $t5);
		var $t6 = new $TestAngularJS_CartItem();
		$t6.title = 'ffff';
		$t6.quantity = 4096;
		$t6.price = 66.95;
		ss.add(items, $t6);
		return items;
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.LabelsFactory
	var $TestAngularJS_LabelsFactory = function() {
	};
	$TestAngularJS_LabelsFactory.LabelEuro = function() {
		return 'CHF';
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.PhoneConfig
	var $TestAngularJS_PhoneConfig = function(_routeProvider) {
		var $t1 = {};
		$t1.templateUrl = 'phonemain.html';
		var $t3 = _routeProvider.when('/phones', $t1);
		var $t2 = {};
		$t2.templateUrl = 'phonedetail.html';
		var $t5 = $t3.when('/phones/:phoneId', $t2);
		var $t4 = {};
		$t4.redirectTo = '/phones';
		$t5.otherwise($t4);
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.PhoneExample
	var $TestAngularJS_PhoneExample = function() {
	};
	$TestAngularJS_PhoneExample.Main = function() {
		var app = angular.module('myApp', []);
		AngularJS.AngularUtils.RegisterConfig(app, $TestAngularJS_PhoneConfig);
		AngularJS.AngularUtils.RegisterController(app, $TestAngularJS_PhoneListController);
		AngularJS.AngularUtils.RegisterController(app, $TestAngularJS_PhoneListControllerDetail);
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.PhoneListController
	var $TestAngularJS_PhoneListController = function(_scope, _http) {
		this.what = null;
		this.person = null;
		this.what = 'main';
		//
		//         http.Get("hello.html").Success((data,status)=> {
		//
		//         Window.Alert(data.ToString());
		//
		//         }).Error((data,status)=>{
		//
		//         Window.Alert("errore!");
		//
		//         });
		var risp = _http.get('data.json');
		risp.success(ss.mkdel(this, function(data, status, header) {
			this.person = data;
			window.alert(this.person['name'].toString());
		}));
		risp.error(function(data1, status1) {
			window.alert('errore!');
		});
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.PhoneListControllerDetail
	var $TestAngularJS_PhoneListControllerDetail = function(_scope, _routeParams) {
		this.what = null;
		this.phoneId = 0;
		this.what = 'detail';
		this.phoneId = _routeParams.phoneId;
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.PhoneRouteParams
	var $TestAngularJS_PhoneRouteParams = function() {
		this.phoneId = 0;
		AngularJS.RouteParams.call(this);
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.ShoppingCartExample
	var $TestAngularJS_ShoppingCartExample = function() {
	};
	$TestAngularJS_ShoppingCartExample.Main = function() {
		var app = angular.module('myApp', []);
		AngularJS.AngularUtils.RegisterFactory(app, $TestAngularJS_ItemsFactory);
		AngularJS.AngularUtils.RegisterFactory(app, $TestAngularJS_LabelsFactory);
		AngularJS.AngularUtils.RegisterFilter(app, $TestAngularJS_Filters);
		AngularJS.AngularUtils.RegisterController(app, $TestAngularJS_CartController);
	};
	////////////////////////////////////////////////////////////////////////////////
	// TestAngularJS.StartUpController
	var $TestAngularJS_StartUpController = function(_scope) {
		this.fundingStartingEstimate = 0;
		this.fundingNeeded = 0;
		AngularJS.Scope.call(this);
		this.fundingStartingEstimate = 0;
		this.$watch(ss.mkdel(this, function() {
			return this.fundingStartingEstimate;
		}), ss.mkdel(this, this.compneeded));
	};
	$TestAngularJS_StartUpController.prototype = {
		computeNeeded: function() {
			this.fundingNeeded = this.fundingStartingEstimate * 10;
		},
		requestFunding: function() {
			window.alert('Sorry, please get more customers first.');
		},
		reset: function() {
			this.fundingStartingEstimate = 0;
		},
		compneeded: function(newval, oldval) {
			this.fundingNeeded = this.fundingStartingEstimate * 10;
		}
	};
	ss.registerClass(global, 'TestAngularJS.AccordionController', $TestAngularJS_AccordionController);
	ss.registerClass(global, 'TestAngularJS.AccordionDefinition', $TestAngularJS_AccordionDefinition, AngularJS.DirectiveDefinition);
	ss.registerClass(global, 'TestAngularJS.AccordionSharedController', $TestAngularJS_AccordionSharedController);
	ss.registerClass(global, 'TestAngularJS.CartController', $TestAngularJS_CartController, AngularJS.Scope);
	ss.registerClass(global, 'TestAngularJS.CartItem', $TestAngularJS_CartItem);
	ss.registerClass(global, 'TestAngularJS.DirectivesExample', $TestAngularJS_DirectivesExample);
	ss.registerClass(global, 'TestAngularJS.ExpanderController', $TestAngularJS_ExpanderController);
	ss.registerClass(global, 'TestAngularJS.ExpanderDefinition', $TestAngularJS_ExpanderDefinition, AngularJS.DirectiveDefinition);
	ss.registerClass(global, 'TestAngularJS.Filters', $TestAngularJS_Filters);
	ss.registerClass(global, 'TestAngularJS.FundingExample', $TestAngularJS_FundingExample);
	ss.registerClass(global, 'TestAngularJS.HelloDirective', $TestAngularJS_HelloDirective, AngularJS.DirectiveDefinition);
	ss.registerClass(global, 'TestAngularJS.ItemsFactory', $TestAngularJS_ItemsFactory);
	ss.registerClass(global, 'TestAngularJS.LabelsFactory', $TestAngularJS_LabelsFactory);
	ss.registerClass(global, 'TestAngularJS.PhoneConfig', $TestAngularJS_PhoneConfig);
	ss.registerClass(global, 'TestAngularJS.PhoneExample', $TestAngularJS_PhoneExample);
	ss.registerClass(global, 'TestAngularJS.PhoneListController', $TestAngularJS_PhoneListController);
	ss.registerClass(global, 'TestAngularJS.PhoneListControllerDetail', $TestAngularJS_PhoneListControllerDetail);
	ss.registerClass(global, 'TestAngularJS.PhoneRouteParams', $TestAngularJS_PhoneRouteParams, AngularJS.RouteParams);
	ss.registerClass(global, 'TestAngularJS.ShoppingCartExample', $TestAngularJS_ShoppingCartExample);
	ss.registerClass(global, 'TestAngularJS.StartUpController', $TestAngularJS_StartUpController, AngularJS.Scope);
})();
