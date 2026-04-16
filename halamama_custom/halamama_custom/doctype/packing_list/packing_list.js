// Copyright (c) 2026, Rakonex and contributors
// For license information, please see license.txt

frappe.ui.form.on("Packing List", {
	from_document(frm) {
        if(!frm.doc.from_doctype || !frm.doc.from_document) {
            return;
        } else {
            if(frm.doc.from_doctype == "Purchase Order") {
                frappe.db.get_value("Purchase Order", frm.doc.from_document, ["supplier", "supplier_name"])
                .then(r=>{
                    if(r && r.message){
                        if(r.message.supplier){
                            frm.set_value("supplier", r.message.supplier)
                        }
                        if(r.message.supplier){
                            frm.set_value("supplier_name", r.message.supplier_name)
                        }
                    }
                });
            } else if(frm.doc.from_doctype == "Material Request"){
                frappe.db.get_value("Material Request", frm.doc.from_document, ["set_from_warehouse", "set_warehouse"])
                .then(r=>{
                    if(r && r.message){
                        if(r.message.set_from_warehouse){
                            frm.set_value("from_warehouse", r.message.set_from_warehouse)
                        }
                        if(r.message.supplier){
                            frm.set_value("to_warehouse", r.message.set_warehouse)
                        }
                    }
                });
            }
        }
	},

    fetch_items(frm){
        if(!frm.doc.from_document){
            frappe.msgprint({
                title: "Unable to Fetch",
                message: "From Document field is empty",
                indicator: "blue"
            });
        } else {
            let ref_doctype = frm.doc.from_doctype;
            
            if(ref_doctype == "Purchase Order"){
                frappe.db.get_doc(ref_doctype, frm.doc.from_document)
                .then(po=>{
                    if(po.items){
                        frm.clear_table("items");
                        (po.items || []).forEach(po_item=>{
                            const row = frm.add_child("items");
                            row.item_code = po_item.item_code;
                            row.item_name = po_item.item_name;
                            row.qty = po_item.qty;
                        });
                        frm.refresh_field("items");
                    }
                });
            }
        }
    }
});
