import React , { Component } from 'react';
import SuTechGrid from "../components/SuTechGrid";

class ActivityList extends Component {

    constructor(prop) {
        super(prop);
        this.state={
            control : 1 ,
            detailTargetData : null,
            gridConf:{
                selectedData : null,
                columnsDef :[
                    {caption : '作業者' , propName : 'author'},
                    {caption : '作業内容' , propName : 'content'},
                ],
            },
            activities:[],
        };
        this.openActivityDetail=this.openActivityDetail.bind(this)

    }
    componentDidMount() {
        this.setState({
            activities: [
                { id : 1 , author : 'suzuki' , content : '株式会社XXXXの環境作成を完了' },
                { id : 2 , author : 'sato' , content : '株式会社XXXXを登録' },
                { id : 3 , author : 'kato' , content : '株式会社XXXXを登録' },
                { id : 4 , author : 'yamada' , content : '株式会社XXXXを登録' },
                { id : 5 , author : 'abe' , content : '株式会社XXXXを登録' },
                { id : 6 , author : 'suzuki' , content : '株式会社XXXXを登録' },
            ]})
    }

    openActivityDetail(data){
        console.log(data);
        this.setState({
            control : 2 ,
            detailTargetData : data.id,
        })
    }

    render() {
        if(this.state.control===1){
            return <SuTechGrid gridConf={this.state.gridConf} datas={this.state.activities}
                               handlerOnRowClick={this.openActivityDetail} />
        }else{
            if (this.state.control===2){
                return <div>goto detail target={this.state.detailTargetData}</div>
            }else{

            }
        }
        return <div>{this.state.detailTargetData}</div>
    }
}

export default ActivityList