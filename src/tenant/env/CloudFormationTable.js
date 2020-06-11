import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles(theme => ({
    container: {
        maxHeight: 440,
    },
    table: {
        maxHeight: 440,
    },
    row: {
        '& > *': {
            borderBottom: 'unset',
        },
    }
}));

function Row(props){
    const {c,p,resources} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return (
        <>
            <TableRow  className={classes.row}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>

                </TableCell>
                <TableCell component="th" scope="row">
                    {c+1}
                </TableCell>
                <TableCell component="th" scope="row">
                    {p}
                </TableCell>
                <TableCell>{resources[p].Type}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    {Object.keys(resources[p].Properties).sort().map((property,t) => (
                                        <TableRow key={t}>
                                            <TableCell component="th" scope="row">
                                                {property}
                                            </TableCell>
                                            <TableCell>{JSON.stringify(resources[p].Properties[property])}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}


const CloudFormationTable = props => {
    const classes = useStyles();
    const resources = props.resources;

    function compare(a, b){
        const pointA = orders[resources[a].Type];
        const pointB = orders[resources[b].Type];
        if(pointA===undefined)console.log("not found:" + resources[a].Type);
        if(pointB===undefined)console.log("not found:" + resources[b].Type);
        if(pointA===pointB){
            return a - b;
        }else{
            return pointA - pointB;
        }
    }

    const keys = Object.keys(resources).sort(compare);

    return (
        <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {keys.map( (p,c) => (
                        <Row c={c} p={p} resources={resources} key={c} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    )
}
export default CloudFormationTable;

const orders = {
    "AWS::EC2::VPC" : 1,
    "AWS::EC2::InternetGateway" : 2,
    "AWS::EC2::VPCGatewayAttachment" : 3,
    "AWS::EC2::Subnet" : 10,
    "AWS::EC2::RouteTable" : 11,
    "AWS::EC2::Route" : 12,
    "AWS::EC2::SubnetRouteTableAssociation" : 13,
    "AWS::EC2::EIP" : 21,
    "AWS::EC2::NatGateway" : 22,
    "AWS::EC2::VPCEndpoint" : 24,
    "AWS::EC2::SecurityGroup" : 50,
    "AWS::EC2::SecurityGroupIngress" : 51,
    "AWS::ElasticLoadBalancingV2::LoadBalancer" : 100,
    "AWS::ElasticLoadBalancingV2::Listener" : 101,
    "AWS::ElasticLoadBalancingV2::TargetGroup" : 102,
    "AWS::ElasticLoadBalancingV2::ListenerRule" : 103,
    "AWS::AutoScaling::AutoScalingGroup" : 110,
    "AWS::AutoScaling::LaunchConfiguration" : 111,
    "AWS::AutoScaling::ScheduledAction" : 119,
    "AWS::EC2::Instance" : 200,
    "AWS::EFS::FileSystem" : 900,
    "AWS::EFS::MountTarget" : 901,
    "AWS::Route53::HostedZone" : 1000,
    "AWS::Route53::RecordSet" : 1001,
}
