/**
 * Copyright 2011-2018 OpenAjax Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import {OpenAjax} from '../openajax_a11y_constants.js';

/* ---------------------------------------------------------------- */
/*  OpenAjax Alliance Control Rules                                 */
/* ---------------------------------------------------------------- */

OpenAjax.a11y.RuleManager.addRulesFromJSON([

/**
 * @object WIDGET_1
 *
 * @desc ARIA Widgets must have accessible names
 */

{ rule_id             : 'WIDGET_1',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[role="widget"]'],
  primary_property    : 'accessible_name',
  resource_properties : ['accessible_description', 'computed_label_source'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var widgets     = dom_cache.controls_cache.widget_elements;
     var widgets_len = widgets.length;

     // Check to see if valid cache reference
     if (widgets && widgets_len) {

       for (var i = 0; i < widgets_len; i++) {
         var we = widgets[i];
         var de = we.dom_element;

         if (de.is_widget) {

           if (de.computed_style.is_visible_to_at == VISIBILITY.VISIBLE) {

             if (we.computed_label && we.computed_label.length) {
               rule_result.addResult(TEST_RESULT.PASS, we, 'ELEMENT_PASS_1', [de.tag_name, de.role, we.computed_label]);
             }
             else {
               if (de.role_info.nameRequired) {
                 rule_result.addResult(TEST_RESULT.FAIL, we, 'ELEMENT_FAIL_1', [de.tag_name, de.role]);
               } else {
                rule_result.addResult(TEST_RESULT.MANUAL_CHECK, we, 'ELEMENT_MC_1', [de.tag_name, de.role]);
              }
            }
           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, we, 'ELEMENT_HIDDEN_1', [de.tag_name, de.role]);
           }
         }
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_2
 *
 * @desc Elements with onClick event handlers event handlers need role
 */

{ rule_id             : 'WIDGET_2',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[onClick]'],
  primary_property    : 'has_click',
  resource_properties : ['tag_name', 'role', 'is_widget'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     function hasDecendantWidgetRole(dom_element) {

       function checkChildren(list) {

         if (!list) return false;

         var flag = false;

         for (var i = 0; (i < list.length) && !flag; i++) {

           var de = list[i];

           if (de.type != Node.ELEMENT_NODE) continue;

           if (de.is_widget ||
               "input textarea button select".indexOf(de.tag_name) ||
               de.tag_name === "a" ||
               de.tag_name === "area") return true;

           if (de.child_dom_elements.length) flag = checkChildren(de.child_dom_elements);

         }

         return flag;

       }

       return checkChildren(dom_element.child_dom_elements);
     }

    var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
    var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

    var dom_elements     = dom_cache.element_cache.dom_elements;
    var dom_elements_len = dom_elements.length;

    if (dom_elements && dom_elements_len) {

      for (var i = 0; i < dom_elements_len; i++) {
        var de = dom_elements[i];
        var style = de.computed_style;

        if (de.events.has_click &&
            ((de.tag_name !== 'body') &&
             (de.tag_name !== 'frame') &&
             (de.tag_name !== 'iframe') &&
             (de.tag_name !== 'embed') &&
             (de.tag_name !== 'object') &&
             (de.tag_name !== 'applet'))) {

          if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

            if (de.is_widget) {
              rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [de.tag_name]);
            }
            else {
              if ("input textarea button select".indexOf(de.tag_name) >= 0) {
                rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_2', [de.tag_name]);
              }
              else {
                if ("a area".indexOf(de.tag_name) >= 0) {
                  rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_3', [de.tag_name]);
                }
                else {
                  if (hasDecendantWidgetRole(de)) rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MC_1', [de.tag_name]);
                  else rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [de.tag_name]);
                }
              }
            }
          }
          else {
            rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.tag_name]);
          }
        }
      } // end loop
    }
  } // end validation function
},

/**
 * @object WIDGET_3
 *
 * @desc Elements with role values must have valid widget or landmark roles
 */

{ rule_id             : 'WIDGET_3',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[role]'],
  primary_property    : 'role',
  resource_properties : [],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var elements_with_role     = dom_cache.controls_cache.elements_with_role;
     var elements_with_role_len = elements_with_role.length;

     if (elements_with_role && elements_with_role_len) {

       for (var i = 0; i < elements_with_role_len; i++) {
         var de = elements_with_role[i];
         var style = de.computed_style;

         if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

           if (de.is_widget) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [de.role]);
           else if (de.is_landmark) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_2', [de.role]);
           else if (de.is_live) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_3', [de.role]);
           else if (de.is_section) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_4', [de.role]);
           else if (de.is_abstract) rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [de.role]);
           else if (de.role.length === 0) rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_2', []);
           else rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_3', [de.role]);
         }
         else {
           rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.tag_name, de.role]);
         }
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_4
 *
 * @desc Elements with ARIA attributes have valid values
 */

{ rule_id             : 'WIDGET_4',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[aria-atomic]',
                         '[aria-autocomplete]',
                         '[aria-busy]',
                         '[aria-checked]',
                         '[aria-colcount]',
                         '[aria-colindex]',
                         '[aria-colspan]',
                         '[aria-current]',
                         '[aria-disabled]',
                         '[aria-dropeffect]',
                         '[aria-expanded]',
                         '[aria-grabbed]',
                         '[aria-haspopup]',
                         '[aria-hidden]',
                         '[aria-invalid]',
                         '[aria-label]',
                         '[aria-labelledby]',
                         '[aria-live]',
                         '[aria-modal]',
                         '[aria-multiline]',
                         '[aria-multiselectable]',
                         '[aria-orientation]',
                         '[aria-pressed]',
                         '[aria-readonly]',
                         '[aria-relevant]',
                         '[aria-required]',
                         '[aria-rowcount]',
                         '[aria-rowindex]',
                         '[aria-rowspan]',
                         '[aria-selected]',
                         '[aria-sort]'],
  primary_property    : '',
  resource_properties : [],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     function makeProp(label, value) {

       var p = {};

       p.label = label;
       p.value = value;
       p.description = "";

       return p;

     }

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var elements_with_aria_attributes     = dom_cache.controls_cache.elements_with_aria_attributes;
     var elements_with_aria_attributes_len = elements_with_aria_attributes.length;

     if (elements_with_aria_attributes && elements_with_aria_attributes_len) {

       for (var i = 0; i < elements_with_aria_attributes_len; i++) {
         var de = elements_with_aria_attributes[i];
         var style = de.computed_style;
         var aria_attrs = de.aria_attributes;
         var aria_attrs_len = aria_attrs.length;

         for (var j = 0; j < aria_attrs_len; j++) {

           var attr = aria_attrs[j];

           var prop = makeProp(attr.name, attr.value);

           if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

             if (attr.is_value_valid && attr.tokens) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [attr.name, attr.value], [prop]);
             else if (attr.is_value_valid) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_2', [attr.name, attr.value, attr.type], [prop]);
             else if (attr.type === 'nmtoken' || attr.type === 'boolean') rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [attr.name, attr.value, attr.tokens], [prop]);
             else if (attr.type === 'nmtokens') rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_2', [attr.name, attr.value, attr.tokens], [prop]);
             else rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_3', [attr.name, attr.value, attr.type], [prop]);

           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [attr.name, attr.value], [prop]);
           }

         } // end loop
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_5
 *
 * @desc ARIA attributes must be defined
 */

{ rule_id             : 'WIDGET_5',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[aria-atomic]',
                         '[aria-autocomplete]',
                         '[aria-busy]',
                         '[aria-checked]',
                         '[aria-controls]',
                         '[aria-describedby]',
                         '[aria-disabled]',
                         '[aria-dropeffect]',
                         '[aria-expanded]',
                         '[aria-flowto]',
                         '[aria-grabbed]',
                         '[aria-haspopup]',
                         '[aria-hidden]',
                         '[aria-invalid]',
                         '[aria-label]',
                         '[aria-labelledby]',
                         '[aria-level]',
                         '[aria-live]',
                         '[aria-multiline]',
                         '[aria-multiselectable]',
                         '[aria-orientation]',
                         '[aria-owns]',
                         '[aria-pressed]',
                         '[aria-readonly]',
                         '[aria-relevant]',
                         '[aria-required]',
                         '[aria-selected]',
                         '[aria-sort]',
                         '[aria-valuemax]',
                         '[aria-valuemin]',
                         '[aria-valuenow]',
                         '[aria-valuetext]'],
  primary_property    : '',
  resource_properties : [],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     function makeProp(label, value) {

       var p = {};

       p.label = label;
       p.value = value;
       p.description = "";

       return p;

     }

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var elements_with_aria_attributes     = dom_cache.controls_cache.elements_with_aria_attributes;
     var elements_with_aria_attributes_len = elements_with_aria_attributes.length;

     if (elements_with_aria_attributes && elements_with_aria_attributes_len) {

       for (var i = 0; i < elements_with_aria_attributes_len; i++) {
         var de = elements_with_aria_attributes[i];
         var style = de.computed_style;
         var aria_attrs = de.aria_attributes;
         var aria_attrs_len = aria_attrs.length;

         for (var j = 0; j < aria_attrs_len; j++) {

           var attr = aria_attrs[j];

           var prop = makeProp(attr.name, attr.value);

           if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

             if (attr.is_valid_attribute) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [attr.name], [prop]);
             else rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [attr.name], [prop]);

           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [attr.name, attr.value], [prop]);
           }

         } // end loop
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_6
 *
 * @desc Widgets must have required properties
 */

{ rule_id             : 'WIDGET_6',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[checkbox]',
                         '[combobox]',
                         '[menuitemcheckbox]',
                         '[option]',
                         '[scrollbar]',
                         '[slider]',
                         '[switch]'],
  primary_property    : 'role',
  resource_properties : [],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     function getRequiredPropertiesAndValues(dom_element, required_props) {

       var rps = [];

       var attrs     = dom_element.aria_attributes;
       var attrs_len = attrs.length;

       for (var i = 0; i < required_props.length; i++) {

         var prop = required_props[i];

         var flag = false;

         for (var j = 0; j <attrs_len; j++) {
           if (prop === attrs[j].name) {
             flag = true;
             break;
           }
         }

         var rp = {};
         rp.label = prop;
         rp.description = "";
         rp.defined = flag;

         if (flag) {
           rp.value  = attrs[j].value;
         }
         else {
           rp.value  = "undefined";
         }

         rps.push(rp);

       }

       return rps;

     }

     function getPropsString(props) {

       var str = "";
       var prop_max = props.length - 1;

       for (var i = 0; i < props.length; i++ ) {
         str += props[i];
         if (i !== prop_max) str += ", ";
       }

       return str;

     }

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var widget_elements     = dom_cache.controls_cache.widget_elements;
     var widget_elements_len = widget_elements.length;

     if (widget_elements && widget_elements) {

       for (var i = 0; i < widget_elements_len; i++) {
         var we = widget_elements[i];
         var de = we.dom_element;
         var style = de.computed_style;

         var required_properties = de.role_info.requiredProps;

         if (required_properties && required_properties.length) {

           if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

             var props_string   = getPropsString(required_properties);
             var required_props = getRequiredPropertiesAndValues(de, required_properties);

             var flag = true;

             for (var j = 0; (j < required_props.length) && flag; j++) flag = flag && required_props[j].defined;

             if (flag) rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [de.role, props_string], required_props);
             else rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [de.role, props_string], required_props);
           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.role]);
           }
         }
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_7
 *
 * @desc Widgets must have required owned elements
 */

{ rule_id             : 'WIDGET_7',
  last_updated        : '2021-07-02',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[feed]',
                         '[grid]',
                         '[list]',
                         '[listbox]',
                         '[menu]',
                         '[menubar]',
                         '[radiogroup]',
                         '[row]',
                         '[rowgroup]',
                         '[table]',
                         '[tablist]',
                         '[tree]',
                         '[treegrid]'],
  primary_property    : 'role',
  resource_properties : ['aria_busy', 'aria_owns'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {


     function getRequiredChildRolesString(required_children) {

       var str = "";
       var required_children_max = required_children.length - 1;

       for (var i = 0; i < required_children.length; i++ ) {
         str += required_children[i];
         if (i !== required_children_max) str += ", ";
       }

       return str;

     }

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var widget_elements     = dom_cache.controls_cache.widget_elements;
     var widget_elements_len = widget_elements.length;

     if (widget_elements && widget_elements) {

       for (var i = 0; i < widget_elements_len; i++) {
         var we = widget_elements[i];
         var de = we.dom_element;
         var style = de.computed_style;

         var required_child_roles = de.role_info.requiredChildren;

         if (required_child_roles && required_child_roles.length) {

           if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

             if (we.aria_busy) {
               rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_2', [de.role]);
             } else {
               var flag = false;

               for (var j = 0; (j < required_child_roles.length) && !flag; j++) {
                 flag = we.hasRequiredChildRole(required_child_roles[j]);
               }

               var required_child_roles_string = getRequiredChildRolesString(required_child_roles);

               if (flag) {
                rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [de.role, required_child_roles_string]);
               } else {
                rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [de.role, required_child_roles_string]);
              }
             }
           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.role]);
           }
         }
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_8
 *
 * @desc Widgets must have required parent roles
 */

{ rule_id             : 'WIDGET_8',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : [ "caption",
                          "cell",
                          "columnheader",
                          "gridcell",
                          "listitem",
                          "menuitem",
                          "menuitemcheckbox",
                          "menuitemradio",
                          "option",
                          "row",
                          "rowgroup",
                          "rowheader",
                          "tab",
                          "treeitem"
                      ],
  primary_property    : 'role',
  resource_properties : ['aria_owns'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {


     function getRequiredRolesString(required_roles) {

       var str = "";
       var required_roles_max = required_roles.length - 1;

       for (var i = 0; i < required_roles.length; i++ ) {
         if (i > 0) {
          if ( i === required_roles_max) {
            str += "@ or @" + required_roles[i];
          } else {
            str += "@, @" + required_roles[i];
;
          }
         } else {
           str += required_roles[i];
         }
       }

       return str;

     }

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var widget_elements     = dom_cache.controls_cache.widget_elements;
     var widget_elements_len = widget_elements.length;

     if (widget_elements && widget_elements) {

       for (var i = 0; i < widget_elements_len; i++) {
         var we = widget_elements[i];
         var de = we.dom_element;
         var style = de.computed_style;

         var required_parent_roles = de.role_info.requiredParents;

         if (required_parent_roles && required_parent_roles.length) {

           if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {

             var flag = false;

             for (var j = 0; (j < required_parent_roles.length) && !flag; j++) {
                var role = required_parent_roles[j];
                flag = we.isOwnedByRole(role);
             }

             var required_roles_string = getRequiredRolesString(required_parent_roles);

             if (flag) {
               rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [de.role, role]);
             } else {
               rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [required_roles_string, de.role]);
             }
           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.role]);
           }
         }
       } // end loop
     }
   } // end validation function
},
/**
 * @object WIDGET_9
 *
 * @desc Widgets cannot be owned by more than one widget
 */

{ rule_id             : 'WIDGET_9',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[aria-owns]'],
  primary_property    : 'is_owned',
  resource_properties : ['owner_controls'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var dom_elements     = dom_cache.element_cache.dom_elements;
     var dom_elements_len = dom_elements.length;
     var we;

     for (var i = 0; i < dom_elements_len; i++) {
        var de = dom_elements[i];

        if (de.owned_by.length === 1) {
          we = de.owned_by[0];
          rule_result.addResult(TEST_RESULT.PASS, we, 'ELEMENT_PASS_1', [we, de]);
        } else {
          if (de.owned_by.length > 1) {
            for (var j = 0; j < de.owned_by.length; j += 1) {
              we = de.owned_by[j];
              rule_result.addResult(TEST_RESULT.FAIL, we, 'ELEMENT_FAIL_1', [we, de]);
            } // end loop
          }
        }
     } // end loop

   } // end validation function
},

/**
 * @object WIDGET_10
 *
 * @desc Range widgets with ariavaluenow mut be in range of aria-valuemin and aria-valuemax
 */

{ rule_id             : 'WIDGET_10',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[role="meter"]',
                         '[role="progress"]',
                         '[role="scrollbar"]',
                         '[role="slider"]',
                         '[role="spinbutton"]'],
  primary_property    : '',
  resource_properties : ['aria-valuemin', 'aria-valuenow', 'aria-valuemax'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var dom_elements     = dom_cache.element_cache.dom_elements;
     var dom_elements_len = dom_elements.length;

     if (dom_elements && dom_elements) {

       for (var i = 0; i < dom_elements_len; i++) {
         var de = dom_elements[i];
         var style = de.computed_style;

         if (de.is_range) {

            if (style.is_visible_to_at === VISIBILITY.VISIBLE) {

              var is_value_required = !('progressbar spinbutton'.indexOf(de.role) >= 0);

              var valuetext          = de.getAttributeValue('aria-valuetext');
              var is_valuetext_valid = de.isAttributeValueValid('aria-valuetext', valuetext);

              var min          = de.getAttributeValue('aria-valuemin');
              var is_min_valid = de.isAttributeValueValid('aria-valuemin', min);

              var max          = de.getAttributeValue('aria-valuemax');
              var is_max_valid = de.isAttributeValueValid('aria-valuemax', max);

              var value          = de.getAttributeValue('aria-valuenow');
              var is_value_valid = de.isAttributeValueValid('aria-valuenow', value);

              if (is_valuetext_valid) {
                rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_1', [de, valuetext]);
              } else {
                if (is_value_valid) {
                  if (is_max_valid && is_min_valid) {
                    if (min < max) {
                      if ((min <= value) && (value <= max)) {
                        rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_2', [de, value, min, max]);
                      } else {
                        rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [value, min, max]);
                      }
                    } else {
                      rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_2', [min, max]);
                    }
                  } else {
                    rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_3', [de, min, max]);
                  }
                } else {
                  if (is_value_required) {
                    rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_4', [de]);
                  } else {
                    rule_result.addResult(TEST_RESULT.PASS, de, 'ELEMENT_PASS_3', [de]);
                  }
                }
              }
            } else {
              rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de]);
            }
         }
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_11
 *
 * @desc Elements with mouse down, mouse move and mouse up events must have roles
 */

{ rule_id             : 'WIDGET_11',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP3,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[onmousedown]', '[onmouseup]', '[onmousemove]', '[onkeydown]', '[onkeyup]', '[onkeypress]', '[onclick]', '[ondbclick]', '[ondrag]', '[ondragstart]', '[ondragend]', '[ondragover]', '[onenter]', '[ondragleave]', '[ondrop]'],
  primary_property    : '',
  resource_properties : [],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     function getUIEvents(dom_element) {

        var events = dom_element.getMouseEvents();
        events += dom_element.getClickEvents();
        events += dom_element.getDragEvents();
        events += dom_element.getKeyboardEvents();

        return events;
     }

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var dom_elements_with_events     = dom_cache.controls_cache.elements_with_events;
     var dom_elements_with_events_len = dom_elements_with_events.length;

     if (dom_elements_with_events_len) {

       for (var i = 0; i < dom_elements_with_events_len; i++) {
         var de = dom_elements_with_events[i];

         var style = de.computed_style;
         var events = getUIEvents(de);

         if (events.length &&
             (de.tag_name !== 'embed') &&
             (de.tag_name !== 'applet') &&
             (de.tag_name !== 'object') &&
             (de.tag_name !== 'video') &&
             (de.tag_name !== 'audio')) {

           if (style.is_visible_to_at === VISIBILITY.VISIBLE) {

             if (de.is_widget) {
               rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MANUAL_CHECK_1', [de.role, events]);
             }
             else {
               if (de.is_interactive) rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MANUAL_CHECK_2', [de.tag_name, events]);
               else if (de.containsInteractiveElements()) rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MANUAL_CHECK_3', [de.tag_name, events]);
               else rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [de.tag_name, events]);
             }
           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.tag_name]);
           }
         }
       } // end loop
     }
   } // end validation function
},
/**
 * @object WIDGET_12
 *
 * @desc Element with widget role label should describe the purpose of the widget
 *
 */

{ rule_id             : 'WIDGET_12',
  last_updated        : '2015-08-10',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP2,
  wcag_primary_id     : '2.4.6',
  wcag_related_ids    : ['1.3.1', '3.3.2'],
  target_resources    : ['[role="widget"]'],
  primary_property    : 'accessible_name',
  resource_properties : ['accessible_description', 'computed_label_source'],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var widgets     = dom_cache.controls_cache.widget_elements;
     var widgets_len = widgets.length;

     // Check to see if valid cache reference
     if (widgets && widgets_len) {

       for (var i = 0; i < widgets_len; i++) {
         var we = widgets[i];
         var de = we.dom_element;

         if (de.is_widget) {

           if (de.computed_style.is_visible_to_at == VISIBILITY.VISIBLE) {

             if (we.computed_label && we.computed_label.length) {
               rule_result.addResult(TEST_RESULT.MANUAL_CHECK, we, 'ELEMENT_MC_1', [we.computed_label, de.tag_name, de.role]);
             }
             else {
               if (!de.role_info.nameRequired) rule_result.addResult(TEST_RESULT.MANUAL_CHECK, we, 'ELEMENT_MC_2', [de.tag_name, de.role]);
               else rule_result.addResult(TEST_RESULT.FAIL, we, 'ELEMENT_FAIL_1', [de.tag_name, de.role]);
             }
           }
           else {
             rule_result.addResult(TEST_RESULT.HIDDEN, we, 'ELEMENT_HIDDEN_1', [de.tag_name, de.role]);
           }
         }
       } // end loop
     }
   } // end validation function
},

/**
 * @object WIDGET_13
 *
 * @desc Roles that prohibit accessible names
 */

{ rule_id             : 'WIDGET_13',
  last_updated        : '2021-07-07',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP2,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : ['2.4.6'],
  target_resources    : [ "caption",
                          "code",
                          "deletion",
                          "emphasis",
                          "generic",
                          "insertion",
                          "none",
                          "paragraph",
                          "presentation",
                          "strong",
                          "subscript",
                          "superscript"],
  primary_property    : '',
  resource_properties : [],
  language_dependency : "",
  validate            : function (dom_cache, rule_result) {


     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var dom_elements     = dom_cache.element_cache.dom_elements;
     var dom_elements_len = dom_elements.length;

     for (var i = 0; i < dom_elements_len; i++) {
        var de = dom_elements[i];
        var style = de.computed_style;
        var implicit_role = '';

        if (de.element_aria_info) {
          implicit_role = de.element_aria_info.defaultRole;
        }

        if (de.has_aria_label || de.has_aria_labelledby) {

          if (de.role && OpenAjax.a11y.aria.designPatterns[de.role].nameProhibited) {
            if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {
              rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [de.tag_name, de.role]);
            } else {
              rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.tag_name, de.role]);
            }
          } else {
            if (!de.role && implicit_role && OpenAjax.a11y.aria.designPatterns[implicit_role].nameProhibited) {
              if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {
                if (de.tag_name === 'a') {
                  rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_3', []);
                } else {
                  rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_2', [de.tag_name]);
                }
              } else {
                rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_2', [de.tag_name]);
              }
            }
          }
        } // end loop
      }
   } // end validation function
},

/**
 * @object WIDGET_14
 *
 * @desc     Verify live regions are being used properly
 */
{ rule_id             : 'WIDGET_14',
  last_updated        : '2017-02-08',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP2,
  wcag_primary_id     : '4.1.2',
  wcag_related_ids    : [],
  target_resources    : ['[role="alert"]','[role="log"]','[role="status"]','[aria-live]'],
  primary_property    : 'is_live',
  resource_properties : ['is_live', 'role','aria_live', 'aria_atomic', 'aria_busy', 'aria_relavent'],
  language_dependency : "",
  validate          : function (dom_cache, rule_result) {

    var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;
    var VISIBILITY  = OpenAjax.a11y.VISIBILITY;

    var dom_elements     = dom_cache.element_cache.dom_elements;
    var dom_elements_len = dom_elements.length;


    for (var i = 0; i < dom_elements_len; i++ ) {

      var de =dom_elements[i];

      if (de.type != Node.ELEMENT_NODE || !de.is_live || (de.aria_live === 'off')) continue;

      var has_failure = false;

      var has_live_role =  de.role && de.role.length && (" alert log status".indexOf(de.role) > 0);


      if (de.has_aria_live) {
        if (de.computed_style.is_visible_to_at === VISIBILITY.HIDDEN) {
          rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.tag_name, de.aria_live]);
        }
        else {
          if (has_live_role) {

            switch (de.role) {

              case 'alert':
                if (de.aria_live === 'polite') {
                  rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', ['polite', 'assertive',  de.role]);
                  has_failure = true;
                }
                break;

              case 'log':
              case 'status':
                if (de.aria_live === 'assertive') {
                  rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', ['assertive', 'polite', de.role]);
                  has_failure = true;
                }
                break;

              default:
                break;

            }
          }
          else {
            rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MC_1', [de.tag_name, de.aria_live]);
          }
        }
      }

      if (de.has_aria_atomic && has_live_role && (de.role === 'alert' || de.role === 'status')) {

        if (de.aria_atomic === 'false') {
          rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_2', [de.role]);
          has_failure = true;
        }

      }

      if(has_live_role && !has_failure) {

        switch (de.role) {

          case 'alert':
            if (de.computed_style.is_visible_to_at === VISIBILITY.HIDDEN) {
              rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_2', [de.tag_name, de.role]);
            }
            else {
              rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MC_2', [de.tag_name]);
            }
            break;

          case 'log':
            if (de.computed_style.is_visible_to_at === VISIBILITY.HIDDEN) {
              rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_2', [de.tag_name, de.role]);
            }
            else {
              rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MC_3', [de.tag_name]);
            }
            break;

          case 'status':
            if (de.computed_style.is_visible_to_at === VISIBILITY.HIDDEN) {
              rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_2', [de.tag_name, de.role]);
            }
            else {
              rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MC_4', [de.tag_name]);
            }
            break;

          default:
            break;
        }
      }
    }
  } // end validation function
},

/**
 * @object WIDGET_15
 *
 * @desc     Roles with deprecated ARIA attributes
 */
{ rule_id             : 'WIDGET_15',
  last_updated        : '2021-08-10',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP2,
  wcag_primary_id     : '4.1.1',
  wcag_related_ids    : ['4.1.2'],
  target_resources    : [
        "alert",
        "alertdialog",
        "article",
        "banner",
        "blockquote",
        "button",
        "caption",
        "cell",
        "checkbox",
        "code",
        "command",
        "complementary",
        "composite",
        "contentinfo",
        "definition",
        "deletion",
        "dialog",
        "directory",
        "document",
        "emphasis",
        "feed",
        "figure",
        "form",
        "generic",
        "grid",
        "group",
        "heading",
        "img",
        "input",
        "insertion",
        "landmark",
        "link",
        "list",
        "listbox",
        "listitem",
        "log",
        "main",
        "marquee",
        "math",
        "meter",
        "menu",
        "menubar",
        "menuitem",
        "menuitemcheckbox",
        "menuitemradio",
        "navigation",
        "note",
        "option",
        "paragraph",
        "presentation",
        "progressbar",
        "radio",
        "radiogroup",
        "range",
        "region",
        "row",
        "rowgroup",
        "scrollbar",
        "search",
        "section",
        "sectionhead",
        "select",
        "separator",
        "spinbutton",
        "status",
        "strong",
        "structure",
        "subscript",
        "superscript",
        "switch",
        "tab",
        "table",
        "tablist",
        "tabpanel",
        "term",
        "time",
        "timer",
        "toolbar",
        "tooltip",
        "tree",
        "treegrid",
        "treeitem",
        "widget",
        "window"
    ],
  primary_property    : 'role',
  resource_properties : [
        "aria-disabled",
        "aria-errormessage",
        "aria-haspopup",
        "aria-invalid",
        "aria-checked",
        "aria-selected"
    ],
  language_dependency : "",
  validate          : function (dom_cache, rule_result) {

     var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
     var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

     var dom_elements     = dom_cache.element_cache.dom_elements;
     var dom_elements_len = dom_elements.length;

     for (var i = 0; i < dom_elements_len; i++) {
        var de = dom_elements[i];
        var style = de.computed_style;
        var role = de.role;
        var implicit_role = '';
        var deprecatedProps = [];

        if (!de.has_role && de.element_aria_info) {
          implicit_role = de.element_aria_info.defaultRole;
        }

        if (de.has_role && OpenAjax.a11y.aria.designPatterns[role]) {
          deprecatedProps = OpenAjax.a11y.aria.designPatterns[role].deprecatedProps;
        } else {
          if (implicit_role && OpenAjax.a11y.aria.designPatterns[implicit_role]) {
            deprecatedProps = OpenAjax.a11y.aria.designPatterns[implicit_role].deprecatedProps;
          }
        }

        if (deprecatedProps.length) {
          for (var j = 0; j < deprecatedProps.length; j += 1) {
            var prop = deprecatedProps[j];

            if (de.node.hasAttribute(prop)) {

              if (role) {
                if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {
                  rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_1', [prop, de.tag_name, role]);
                } else {
                  rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [prop, de.tag_name, role]);
                }
              } else {
                if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {
                  rule_result.addResult(TEST_RESULT.FAIL, de, 'ELEMENT_FAIL_2', [prop, de.tag_name, implicit_role]);
                } else {
                  rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_2', [prop, de.tag_name, implicit_role]);
                }
              }
            }
          }
        }
      }
  } // end validation function
},

/**
 * @object WIDGET_16
 *
 * @desc     Web compnents require manual check
 */
{ rule_id             : 'WIDGET_16',
  last_updated        : '2021-09-12',
  rule_scope          : OpenAjax.a11y.RULE_SCOPE.ELEMENT,
  rule_category       : OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS,
  rule_group          : OpenAjax.a11y.RULE_GROUP.GROUP2,
  wcag_primary_id     : '2.1.1',
  wcag_related_ids    : ['1.1.1','1.4.1','1.4.3','1.4.4','2.1.2','2.2.1','2.2.2', '2.4.7','2.4.3','2.4.7','3.3.2'],
  target_resources    : ["Custom elements using web component APIs"],
  primary_property    : '',
  resource_properties : [],
  language_dependency : "",
  validate          : function (dom_cache, rule_result) {

    var VISIBILITY  = OpenAjax.a11y.VISIBILITY;
    var TEST_RESULT = OpenAjax.a11y.TEST_RESULT;

    var dom_elements     = dom_cache.element_cache.dom_elements;
    var dom_elements_len = dom_elements.length;

    for (var i = 0; i < dom_elements_len; i++) {
      var de = dom_elements[i];
      var style = de.computed_style;

      if (de.tag_name.indexOf('-') >= 0) {
        if (style.is_visible_to_at == VISIBILITY.VISIBLE || style.is_visible_onscreen == VISIBILITY.VISIBLE ) {
          rule_result.addResult(TEST_RESULT.MANUAL_CHECK, de, 'ELEMENT_MC_1', [de.tag_name]);
        } else {
        rule_result.addResult(TEST_RESULT.HIDDEN, de, 'ELEMENT_HIDDEN_1', [de.tag_name]);
        }
      }
    }
  } // end validation function
}

]);




