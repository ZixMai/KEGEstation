import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useUserStore} from "@/stores/user-store";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter} from "@/components/ui/card";

const formSchema = z.object({
    name: z.string().nonempty("Поле \"Имя\" обязательно"),
    lastName: z.string().nonempty("Поле \"Фамилия\" обязательно"),
    patronymic: z.string(),
    school: z.string().nonempty("Поле \"Школа\" обязательно"),
    schoolClassName: z.string().nonempty("Поле \"Класс\" обязательно"),
    locality: z.string().nonempty("Поле \"Населённый пункт\" обязательно"),
})

export function ExamForm() {
    const {setUser} = useUserStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            lastName: "",
            patronymic: "",
            school: "",
            schoolClassName: "",
            locality: ""
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(data)
        setUser(data)
    }

    return (
        <Card className="h-min w-[400px]">
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} id="form">
                    <FieldGroup>
                        <Controller name="lastName" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Фамилия*</FieldLabel>
                                <Input {...field}
                                       id={field.name}
                                       aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>
                        <Controller name="name" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Имя*</FieldLabel>
                                <Input {...field}
                                       id={field.name}
                                       aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>
                        <Controller name="patronymic" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Отчество</FieldLabel>
                                <Input {...field}
                                       id={field.name}
                                       aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>
                        <Controller name="school" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Школа*</FieldLabel>
                                <Input {...field}
                                       id={field.name}
                                       aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>
                        <Controller name="schoolClassName" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Класс*</FieldLabel>
                                <Input {...field}
                                       id={field.name}
                                       aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>
                        <Controller name="locality" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Населённый пункт*</FieldLabel>
                                <Input {...field}
                                       id={field.name}
                                       aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Button type="submit" form="form">
                    Продолжить
                </Button>
            </CardFooter>
        </Card>
    )
}