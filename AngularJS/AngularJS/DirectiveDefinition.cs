﻿using System;

using System.Html;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Serialization;
using System.Reflection;
using System.Diagnostics;

namespace AngularJS
{       
   [Flags] public enum RestrictFlags { Element=1, Attribute=2, Class=4, Comment=8 };
   
   /// <summary>
   /// Defines how the scope is associated with the directive
   /// </summary>     
   public enum ScopeModes 
   { 
      /// <summary>
      /// No scope is created, use the existing scope
      /// </summary>     
      Existing, 
      /// <summary>
      /// A new single scope is created and shared for all instances of the same directive
      /// </summary>     
      New, 
      /// <summary>
      /// A new isolated scope is created and associated to the instance of the directive
      /// </summary>     
      Isolate 
   };

   public enum BindingStrategies 
   { 
      /// <summary>
      /// Binds attribute to scope variable (unidirectionally)
      /// </summary>     
      Unidirectional, 

      /// <summary>
      /// Binds attribute to and from scope variable (bidirectionally)
      /// </summary>     
      Bidirectional, 
      
      /// <summary>
      /// Scope variable is a function that evaluates the attribute
      /// </summary>     
      AsFunction 
   };

   public class ScopeBindings
   {      
      public string ScopeName = null; 
      public string AttributeName = null; 
      public BindingStrategies Strategy = BindingStrategies.Unidirectional;
      
      /// <summary>
      /// Binds attribute to scope variable (unidirectionally)
      /// </summary>     
      public ScopeBindings(string ScopeVariableName)
      {
         this.ScopeName = ScopeVariableName;
         this.Strategy = BindingStrategies.Unidirectional; 
      } 

      /// <summary>
      /// Binds attribute to scope variable (unidirectionally)
      /// </summary>     
      public ScopeBindings(string ScopeVariableName, string AlternateAttributeName)
      {
         this.ScopeName = ScopeVariableName;
         this.Strategy = BindingStrategies.Unidirectional; 
         this.AttributeName = AlternateAttributeName;
      } 

      public ScopeBindings(string ScopeVariableName, BindingStrategies Strategy)
      {
         this.ScopeName = ScopeVariableName;
         this.Strategy = Strategy;         
      } 
      
      public ScopeBindings(string ScopeVariableName, BindingStrategies Strategy, string AlternateAttributeName)
      {
         this.ScopeName = ScopeVariableName;
         this.Strategy = Strategy;         
         this.AttributeName = AlternateAttributeName;
      } 

      public string ScopeBindingString()
      {
         var s = "";

              if(Strategy==BindingStrategies.Unidirectional) s = "@";
         else if(Strategy==BindingStrategies.Bidirectional)  s = "=";
         else if(Strategy==BindingStrategies.AsFunction)     s = "&";

         if(AttributeName!=null) s+=AttributeName;
         return s;
      }     
   }
   
   public class DirectiveDefinition
   {
      /// <summary>
      /// Camel cased name of the Directive
      /// </summary>     
      public string Name;

      /// <summary>
      /// Target of DOM the directive applies (default=restrict to attribute only)
      /// </summary>     
      public RestrictFlags Restrict = RestrictFlags.Attribute;

      /// <summary>
      /// The priority of compilation of the directive. 
      /// Directive with higher priority are compiled first. 
      /// The default priority is 0.
      /// </summary>     
      public int? Priority;   

      /// <summary>
      /// If set to true then the current priority will be the last set of directives which will execute 
      /// (any directives at the current priority will still execute as the order of execution on same priority is undefined).
      /// </summary>     
      public bool? Terminal;

      /// <summary>
      /// Template HTML string that forms the directive body
      /// </summary>     
      public string Template;

      /// <summary>
      /// Url of the template HTML file used for the directive body
      /// </summary>     
      public string TemplateUrl;

      /// <summary>
      /// specify where the template should be inserted. Defaults to false.
      /// true - the template will replace the current element.
      /// false - the template will replace the contents of the current element.
      /// </summary>     
      public bool Replace;

      /// <summary>
      /// If true, specify that the original DOM content within the directive will be TRANSferred and inCLUDED 
      /// in the directive template where the <ng-transclude/> directive is placed.
      /// </summary>     
      public bool Transclude;
      
      /// <summary>
      /// Defines how the scope is associated with the directive
      /// </summary>     
      public ScopeModes ScopeMode = ScopeModes.Existing;
      
      private List<ScopeBindings> ScopeAttributes = new List<ScopeBindings>();            

      private List<string> Require = new List<string>();
            
      /// <summary>
      /// A controller that is instantiated before the pre-linking phase and it is shared with other directives (see require attribute). 
      /// This allows the directives to communicate with each other and augment each other's behavior. 
      /// The controller is injectable (and supports bracket notation) with the following locals: $scope, $element, $attrs, $transclude
      /// </summary>
      public Type SharedController;

      /// <summary>
      /// The controller of the directive which can implement a Link(scope, iElement, iAttrs, controller, transcludeFn) method
      /// </summary>
      public Type DirectiveController;

      private string RestrictString()
      {
         string s = "";
         if((Restrict & RestrictFlags.Element  )==RestrictFlags.Element  ) s+="E";
         if((Restrict & RestrictFlags.Attribute)==RestrictFlags.Attribute) s+="A";
         if((Restrict & RestrictFlags.Class    )==RestrictFlags.Class    ) s+="C";
         if((Restrict & RestrictFlags.Comment  )==RestrictFlags.Comment  ) s+="M";
         return s;
      }

      private string RequireDirectiveString(string ControllerName, bool LookParent, bool Optional)
      {
         string s = ControllerName;
         if(Optional) s="?"+s;
         if(LookParent) s="^"+s;         
         return s;
      }      

      /// <summary>
      /// Require another directive and inject its controller as the fourth argument to the linking function. 
      /// <param name="ControllerName"></param>
      /// <param name="LookParent">Locate the required controller by searching the element's parents. Throw an error if not found.</param>
      /// <param name="Optional">Attempt to locate the required controller or pass null to the link fn if not found.</param>
      /// </summary>     
      public void RequireDirective(string ControllerName, bool LookParent, bool Optional)
      {
         Require.Add(RequireDirectiveString(ControllerName, LookParent, Optional));
      }

      /// <summary>
      /// Binds attribute to scope variable (unidirectionally)
      /// </summary>     
      public void BindAttribute(string ScopeVariableName)
      {
         ScopeAttributes.Add(new ScopeBindings(ScopeVariableName));
      } 

      /// <summary>
      /// Binds attribute to scope variable (unidirectionally)
      /// </summary>     
      public void BindAttribute(string ScopeVariableName, string AlternateAttributeName)
      {
         ScopeAttributes.Add(new ScopeBindings(ScopeVariableName,AlternateAttributeName));
      } 

      /// <summary>
      /// Binds attribute to scope variable
      /// </summary>     
      public void BindAttribute(string ScopeVariableName, BindingStrategies Strategy)
      {
         ScopeAttributes.Add(new ScopeBindings(ScopeVariableName, Strategy));
      }     
      
      /// <summary>
      /// Binds attribute to scope variable 
      /// </summary>     
      public void BindAttribute(string ScopeVariableName, BindingStrategies Strategy, string AlternateAttributeName)
      {
         ScopeAttributes.Add(new ScopeBindings(ScopeVariableName, Strategy, AlternateAttributeName));
      } 

      private JsDictionary CreateDefinitionObject()
      {
         JsDictionary result = new JsDictionary();
         
         // maps name
         if(Name!=null) result["name"] = Name;

         // maps priority
         if(Priority!=null) result["priority"] = Priority;

         // maps terminal
         if(Priority!=null) result["termina"] = Terminal;

         // maps restrict
         result["restrict"] = RestrictString();

         // maps template and templateUrl
              if(Template!=null) result["template"] = Template;
         else if(TemplateUrl!=null) result["templateUrl"] = TemplateUrl;

         // maps replace
         result["replace"] = Replace;

         // maps transclude
         result["transclude"] = Transclude;
         // TODO 'element'

         // maps scope
              if(ScopeMode == ScopeModes.Existing) result["scope"] = false;
         else if(ScopeMode == ScopeModes.New)      result["scope"] = true;
         else if(ScopeMode == ScopeModes.Isolate)
         {
            JsDictionary scope = new JsDictionary();
            foreach(ScopeBindings sb in ScopeAttributes)
            {
               scope[sb.ScopeName] = sb.ScopeBindingString();
            }
            result["scope"] = scope;
         }         

         // maps compile function
         // TODO not supported
         
         // maps (shared) controller         
         if(SharedController != null)
         {
            var scontr = SharedController.BuildControllerFunction(ThisMode.This);
            result["controller"] = scontr;                            
         }                
         
         // maps controllerAs                                    
         // TODO

         // directive controller ('link' function) is managed during the registration process
                                                             
         // maps require
         if(Require!=null) 
         {
            if(Require.Count==1) result["require"] = Require[0]; // as string 
            else result["require"] = Require;                    // as array of strings
         }

         return result;
      }

      public Function CreateDirectiveFunction()
      {         
         object defob = this.CreateDefinitionObject();
         
         List<string> parameters = new List<string>();
         List<string> fnames = new List<string>();

         Type type = this.DirectiveController;

         object SharedController = ((dynamic)defob).controller;

         if(type!=null)
         {
            parameters = Angular.Injector().Annotate(type.GetConstructorFunction());
            fnames = type.GetInstanceMethodNames();
         }       

         string body = "";

         body += "var $obdef = " + Json.Stringify(defob)+";\r\n";

         if(type!=null)
         {
            if(fnames.Contains("Link"))
            {
               body += "var $outer_arguments = arguments;\r\n";
               body += "$obdef.link = function(_scope) { \r\n";

               // save isolated scope bindings that would be overwritten by constructor initialization
               foreach(ScopeBindings sb in this.ScopeAttributes)
               {
                  body += String.Format("var $$saved_{0} = _scope.{0};\r\n",sb.ScopeName);
               }
         
               foreach(string funcname in fnames)
               {
                  body += String.Format("   _scope.{1} = {0}.prototype.{1}.bind(_scope);\r\n",type.FullName,funcname);             
               }
            
               body += String.Format("   {0}.apply(_scope,$outer_arguments);\r\n",type.FullName);

               // retrieves back saved isolated scope bindings
               foreach(ScopeBindings sb in this.ScopeAttributes)
               {
                  body += String.Format("_scope.{0} = $$saved_{0};\r\n",sb.ScopeName);
               }

               body += "   _scope.Link.apply(_scope,arguments);\r\n";
               body += "}\r\n";
            }         
            else 
            {
               throw new Exception("Link() method not defined in directive controller");
            }
         }

         if(SharedController!=null)
         {
            body+= "$obdef.controller = "+SharedController.ToString()+";";
         }
         
         body += "return $obdef;\r\n";

         return TypeExtensionMethods.CreateNewFunction(parameters,body);
      }           

   }
}

