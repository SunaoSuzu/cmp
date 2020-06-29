import React from "react";
import Grid from "@material-ui/core/Grid";
import Field from "./FieldComponent";
import ChildTable from "./ChildTableComponent";


const FormComponent = ({def,data,control , register , errors}) => {
    return (
        <Grid container spacing={1}>
            {def.fields.map( field => {
                if( field.type === "list"){
                    return <ChildTable
                        key={field.field}
                        field={field}
                        register={register}
                        errors={errors}
                        control={control} />
                }else{
                    return <Field
                        key={field.field}
                        field={field}
                        name={field.field}
                        data={data}
                        error={errors?.[field.field]}
                        errorMsg={errors?.[field.field]?.message}
                        register={register}
                        control={control} />
                }
            })}
        </Grid>
    )
};

export default FormComponent;
