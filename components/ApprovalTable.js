import React,{propTypes} from 'react';
import api from '../dhis2API';
import constants from '../constants'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


export function ApprovalTable(props){

    var instance = Object.create(React.Component.prototype);
    instance.props = props;

    var state = {
        user : props.user,
        program : props.program,
        usergroup1 : props.usergroup1,
        usergroup2 : props.usergroup2,
        rawData : props.rawData,
        sdate : props.sdate,
        edate:props.edate,
        selectedOU:props.selectedOU,
        selectedSpeciality : props.selectedSpeciality,
        seletedUserGroup: props.seletedUserGroup,
        ous : props.ous,
        dataO: []
    };
    var dataList = [];
    console.log(state.seletedUserGroup);
    state.dataO = state.rawData.reduce(function(list,data){
        var nameObj = data.attrlist.reduce(function(str,obj){
            if(obj.split(":")[0] === 'T6eQvMXe3MO')
            {
                str = obj;
            }
            return str;
        },'');
        if((state.selectedSpeciality === 'Kd8DRRvZDro' && state.seletedUserGroup == 'all') || (state.selectedSpeciality === 'Bm7Bc9Bnqoh' && state.seletedUserGroup == 'all')){
            dataList.push(data);
        }
        else if(state.selectedSpeciality === 'Kd8DRRvZDro' || state.selectedSpeciality === 'Bm7Bc9Bnqoh'){
            if(state.seletedUserGroup === state.usergroup1.id) {
                state.usergroup1.users.forEach(function (user) {
                    if(nameObj.split(":")[1] === user.userCredentials.username){
                        dataList.push(data);
                    }
                });
            }
            else if(state.seletedUserGroup === state.usergroup2.id) {
                state.usergroup2.users.forEach(function (user) {
                    console.log("data.attrlist['T6eQvMXe3MO']: "+nameObj.split(":")[1])
                    console.log("user.userCredentials.username: "+user.userCredentials.username)
                    if(nameObj.split(":")[1] === user.userCredentials.username){
                        dataList.push(data);
                    }
                });
            }
        }
        else{
            dataList.push(data);
        }
        return dataList;
    },[]);

    var programStageMap = state.program.programStages.reduce(function(map,obj){
        map[obj.id] = obj;
        return map;
    },[]);


    var ouMap = state.ous.reduce(function(map,obj){
        map[obj.id] = obj;
        return map;
    },[]);

    var selectedStage = programStageMap[state.selectedSpeciality];

    instance.render = render;
    return instance;

    function getHeader(){
        var list = [];
        list.push(<th rowSpan={2} className="approval_wideX"  key="h_ou">Org Unit</th>);
        list.push(<th rowSpan={2} className="approval_wide" key="h_name of specilist">Name of Specialist</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_code">Employee Code</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_contact">Contact Number</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_under">Working Under</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_working">Working</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_leave">Leave</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_offday">Off Day</th>);
        selectedStage.
        programStageDataElements.
        reduce(function(list,obj){
            if (obj.displayInReports){
                list.push(<th rowSpan={2} className={obj.valueType != "TEXT"?"approval_nonText":""} key={obj.id}>{obj.dataElement.formName}</th>)
            }
            return list;
        },list);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_reliving">Relieving Date</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_approval">Number of cases approved</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_pending">Number of cases pending</th>);
        list.push(<th rowSpan={2} className="approval_normal"  key="h_rejected">Number of cases rejected</th>);
        return list;
    }

    function getRows(){

        return state.dataO.reduce(function(datalist,data){

            var dvMap = data.delist.reduce(function(map,obj){
				
				map[obj.split(":")[0]] = obj.split(":")[1];
				
                return map;
            },[]);

            var attrMap = data.attrlist.reduce(function(map,obj){
			   
               map[obj.split(":")[0]] = obj.split(":")[1];
                return map;
            },[]);


            if ((state.selectedSpeciality === 'Kd8DRRvZDro' && attrMap["qXQxtcuPO5S"] == 'emoc')
                || (state.selectedSpeciality === 'Bm7Bc9Bnqoh' && attrMap["qXQxtcuPO5S"] == 'LSAS')
               ) {

                var _list1 = [];

                            _list1.push(<td className="approval_wideX" key="d_ou">{getFacilityNameWithHierarchy(data)}</td>);
                            _list1.push(<td className="approval_wide" key="d_name of specilist">{attrMap["U0jQjrOkFjR"]}</td>);
                            _list1.push(<td className="approval_normal" key="d_erhms code">{attrMap["T6eQvMXe3MO"]}</td>);
                            _list1.push(<td className="approval_normal"  key="d_contact">{attrMap["aXT3MKVuHQR"]}</td>);
                            _list1.push(<td className="approval_normal"  key="d_under">{attrMap["n1S8w0pL25l"]}</td>);
                            _list1.push(<td className="approval_normal" key="d_working">{dvMap["Working"]}</td>);
                            _list1.push(<td className="approval_normal" key="d_leave">{dvMap["Leave"]}</td>);
                            _list1.push(<td className="approval_normal" key="d_offday">{dvMap["Off day"]}</td>);
                            selectedStage.
                            programStageDataElements.
                            reduce(function(_list1,obj){
                                if (obj.displayInReports){
                                    _list1.push(<td className={obj.valueType != "TEXT"?"approval_nonText":""}  key={"d"+obj.id+data.tei}>{dvMap[obj.dataElement.id]}</td>)
                                }
                                return _list1;
                            },_list1);
                            var reDate = "";
                            if(attrMap["mE6SY3ro53v"])
                            {
                                reDate = new Date(attrMap["mE6SY3ro53v"]).toLocaleDateString("en-GB");
                            }
                _list1.push(<td className="approval_normal" key="d_reliving">{reDate}</td>);
                _list1.push(<td className="approval_normal" key="d_approved">{dvMap["Approved"] || dvMap["Auto-Approved"]}</td>);
                _list1.push(<td className="approval_normal" key="d_reject">{dvMap["Pending1"] || dvMap["Pending2"]}</td>);
                _list1.push(<td className="approval_normal" key="d_pending">{dvMap["Rejected"]}</td>);
                datalist.push([<tr className={attrMap[constants.attr_releiving_date]?'relieved_doctor':''} key={data.tei}>{_list1}</tr>]);

            }
            else if(((state.selectedSpeciality !== 'Kd8DRRvZDro') || (state.selectedSpeciality !== 'Bm7Bc9Bnqoh')) && state.seletedUserGroup === '-1'){
                var _list = [];
                console.log("In Other");
                console.log(attrMap["U0jQjrOkFjR"]+" "+attrMap["qXQxtcuPO5S"]);
                _list.push(<td className="approval_wideX" key="d_ou">{getFacilityNameWithHierarchy(data)}</td>);
                _list.push(<td className="approval_wide" key="d_name of specilist">{attrMap["U0jQjrOkFjR"]}</td>);
                _list.push(<td className="approval_normal" key="d_erhms code">{attrMap["T6eQvMXe3MO"]}</td>);
                _list.push(<td className="approval_normal"  key="d_contact">{attrMap["aXT3MKVuHQR"]}</td>);
                _list.push(<td className="approval_normal"  key="d_under">{attrMap["n1S8w0pL25l"]}</td>);
                _list.push(<td className="approval_normal" key="d_working">{dvMap["Working"]}</td>);
                _list.push(<td className="approval_normal" key="d_leave">{dvMap["Leave"]}</td>);
                _list.push(<td className="approval_normal" key="d_offday">{dvMap["Off day"]}</td>);
                selectedStage.
                programStageDataElements.
                reduce(function(_list,obj){
                    if (obj.displayInReports){
                        _list.push(<td className={obj.valueType != "TEXT"?"approval_nonText":""}  key={"d"+obj.id+data.tei}>{dvMap[obj.dataElement.id]}</td>)
                    }
                    return _list;
                },_list);
                var reDate = "";
                if(attrMap["mE6SY3ro53v"])
                {
                    reDate = new Date(attrMap["mE6SY3ro53v"]).toLocaleDateString("en-GB");
                }
                _list.push(<td className="approval_normal" key="d_reliving">{reDate}</td>);
                _list.push(<td className="approval_normal" key="d_approved">{dvMap["Approved"] || dvMap["Auto-Approved"]}</td>);
                _list.push(<td className="approval_normal" key="d_reject">{dvMap["Pending1"] || dvMap["Pending2"]}</td>);
                _list.push(<td className="approval_normal" key="d_pending">{dvMap["Rejected"]}</td>);
                datalist.push([<tr className={attrMap[constants.attr_releiving_date]?'relieved_doctor':''} key={data.tei}>{_list}</tr>]);

            }
            return datalist;
        },[]);

       
    }

    function getFacilityNameWithHierarchy(data){
        if (data.psiouuid){
            return data.division + "/" + data.district +"/" + data.block + "/" + data.facility;
        }
        
        return makeFacilityStrBelowLevel(ouMap[data.ouuid],2)
    }
    function makeFacilityStrBelowLevel(ou,level){        
        return ou.ancestors.reduce(function(str,obj){
            if(obj.level>level){
                str = str + obj.name + " / " ;
            }
            return str;
        },"")  + ou.name;                
    }
    
    function render(){
        return ( 
                <div>
                <h5> Report </h5>

                <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button"
            table="table-to-xls"
            filename={"DD_"+state.selectedOU.name+"_"+selectedStage.name+"_"+state.sdate+"-"+state.edate}
            sheet="1"
            buttonText="Download"/>

            
                <table className="approvalTable" id="table-to-xls">
                <thead>
                <tr>
                <th colSpan="1">{state.selectedOU.name}</th>
                <th colSpan={selectedStage.programStageDataElements.length + 7}>{state.sdate} -  {state.edate}</th>

            </tr>
                <tr>                
                <th colSpan={  selectedStage.programStageDataElements.length + 5}>{selectedStage.description}</th>
                <th colSpan={3} className="approval_normal"  key="h_reliving">Approval Status</th>
                </tr>
                <tr>
                {getHeader()}
            </tr>
                </thead>

                <tbody>
               <tr><td colSpan={9}></td></tr>
                
            {getRows()}
            </tbody>
                </table>
        
            </div>
        )
    }
    
}

