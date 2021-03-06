import React from 'react'
import PropTypes from 'prop-types'

import { observer } from 'mobx-react'

import Card from '@components/_core/Card~'
import List from '@components/_core/List~'
import Space from '@components/_core/Space~'
import H from '@components/_core/Header~'
import TagList from '@components/_core/TagList~'

import TaskBlock from '@components/task/Block/TaskBlock'
import StudentBlock from '@components/student/Block/StudentBlock'


import styles from './MentorPage.sass'

const containerOf = type => PropTypes.oneOfType([
    PropTypes.arrayOf(type),
    PropTypes.objectOf(type)
])

const propTypes = {
    name: PropTypes.string.isRequired,
    contacts: containerOf(PropTypes.string).isRequired,
    fields: containerOf(PropTypes.string).isRequired,
    
    about: PropTypes.string,

    tasks: containerOf(PropTypes.string),
    ex: containerOf(PropTypes.object),
    
    acceptsOwn: PropTypes.oneOf(['none', 'any', 'inField']),
    hLevel: PropTypes.number,
    innerSpace: PropTypes.string
}

const defaultProps = {
    hLevel: 2,
    innerSpace: 'm',
    acceptsOwn: 'none',
    tasks: [],
    ex: []
}

const ownToRus = {
    none: 'Не принимает поднаучных со своей темой исследования',
    inField: 'Принимает учеников со своими исследованиями в перечисленных выше областях',
    any: 'Примает поднаучных со своими исследованиями в любой области'
}

const MentorPage = observer(props => {
    const contactsEl = <TagList tags={props.contacts} tagProps={{transparent: true}} />
    const fieldsEl = <TagList tags={props.fields} tagProps={{transparent: true}} />

    const taskCard = props => <Card> <TaskBlock {...props} hLevel={5} /> </Card>
    const exCard = props => <Card> <StudentBlock {...props} hLevel={5} /> </Card>
    
    return (
        <div className={styles.view}>
            <H level={props.hLevel}> {props.name} </H>
            <Space bottom='m' />            

            <Space bottom='m'>
                <H level={3}> {props.contacts.length 
                    ? 'Контакты' 
                    : 'Контакты не указаны' } 
                </H> 
                {contactsEl}
            </Space>
            
            <Space bottom='m'>
                <H level={3}> {props.fields.length 
                    ? 'Области исследований' 
                    : 'Не указаны интересующие области исследований' } 
                </H> 
                {fieldsEl}
            </Space>

            <Space bottom='m'>
                <H level={3}> {ownToRus[props.acceptsOwn]} </H>
            </Space>

            {props.about ? 
                (
                    <Space bottom='m'>
                        <H level={3}> Дополнительная информация </H> 
                        {props.about.split('\n').map((item, key) => {
                            return <span key={key}> {item} <br/> </span>
                        })}
                    </Space>
                ) : null    
            }

            <Space bottom='m'>
                { props.tasks.filter(t => t.title.trim().length || t.desc.trim().length).length ? (
                    <div>
                        <H level={3}> Предлагаемые задачи </H>
                        <Space bottom='s' />
                        <List data={props.tasks.filter(t => t.title.trim().length || t.desc.trim().length)} 
                                item={taskCard}
                                divider={<Space top={props.innerSpace} />} />
                    </div>
                ) : <H level={3}> Преподаватель не указал конкретные задачи </H> }
            </Space>

            { props.ex.length ? (
                <div>
                    <H level={3}> Ученики предыдущих лет </H>
                    <Space bottom='s' />
                    <List data={props.ex}
                          item={exCard} 
                          divider={<Space top={props.innerSpace} />} />
                    <Space top='s' className={styles.sidenote}>
                        Данный список может быть не полным. 
                        Здесь указаны лишь те ученики, 
                        которые предоставили нам свои контактные данные. 
                        <br />
                        Если вы тоже учились у этого человека, то, пожалуйста, 
                        заполните <a href='https://goo.gl/forms/98UKbAnYTUoKw0wH2' target='_blank'> 
                            форму
                        </a>.
                    </Space>
                </div>
            ) : <H level={3}> Ученики предыдущих лет не оставили своих контактов </H> }
        </div>
    )
})

MentorPage.propTypes    = propTypes
MentorPage.defaultProps = defaultProps


export default MentorPage
