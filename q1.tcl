
namespace eval fnCostTasks1 {
  variable rows
  variable frame
  variable project
  array set rows {}

  proc open { space id } {
    variable frame $space
    variable project $id
    array set event [list \
      query select \
      module fnCostTasks1 \
      from fnCostTasks1 \
      project $id
    ]
    chan puts $MAIN::chan [array get event]
  }

  proc 'do'download { resp } {
    set cdown [socket localhost 12346]
    chan configure $cdown -buffering full -translation binary
    array set event {
      query download
      module fnCostTasks1
      filename resultado.xlsx
    }
    chan puts $cdown [array get event]
    flush $cdown
    set data [chan read $cdown]
    close $cdown
    puts $data
  }

  proc 'do'update { resp } {
    variable frame
    variable project
    upvar $resp response
    array set row [deserialize $response(row)]
    variable rows
    array set rows [list $row(id) $response(row)]
  }

  proc 'do'insert { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]

    if { $row(project) != $project } {
      return
    }
    'do'select response
  }

  proc 'do'select { resp } {
    variable frame
    upvar $resp response
    array set row [deserialize $response(row)]
    variable rows
    array set rows [list $row(id) $response(row)]
  }
}
